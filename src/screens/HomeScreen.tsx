import React, {useCallback, useRef, useState} from 'react';
import {Alert, ScrollView, Text, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Button, IconButton} from 'react-native-paper';

import SelectedOrder from '../components/order/SelectedOrder';
import ModalSelectProduct from '../animation/ModalSelectProduct';

import {Product} from '../models/Product';
import {RootStackParamList} from '../routes/routes';
import {getDBConnection} from '../db/connectDB';
import {getAllProducts} from '../repositories/ProductRepository';
import {formatCurrency} from '../utils/format';
import {getTodayWithWeekday} from '../utils/date';
import SelectedPayment from '../components/order/SelectedPayment';
import {createOrder} from '../services/orderService';
import {NewOrderItem} from '../models/OrderItem';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const HomeScreen = (): React.JSX.Element => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const scrollViewRef = useRef<ScrollView>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<NewOrderItem[]>([
    {
      productId: null,
      quantity: null,
      price: null,
      name: null,
    },
  ]);

  // Modal state chứa trạng thái và order index đang chỉnh
  const [modalVisible, setModalVisible] = useState<{
    modalStatus: boolean;
    orderIndex: number | null;
  }>({modalStatus: false, orderIndex: null});

  const [modalPayment, setModalPayment] = useState<{
    modalStatus: boolean;
    paymentTitle: string;
  }>({
    modalStatus: false,
    paymentTitle: '',
  });

  // Load sản phẩm từ DB
  const initTable = async () => {
    try {
      const db = await getDBConnection();
      const data = await getAllProducts(db);
      setProducts(data);
    } catch (e) {
      return;
      // console.error('initTable error:', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      initTable();
    }, []),
  );

  // Thêm order mới
  const addOrder = () => {
    setOrders(prev => {
      const newOrders = [
        ...prev,
        {
          productId: null,
          quantity: null,
          price: null,
          name: null,
        },
      ];
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({animated: true});
      }, 100);
      return newOrders;
    });
  };

  // Xóa order
  const handleDelete = (indexToRemove: number) => {
    setOrders(prev => {
      const filtered = prev.filter((_, i) => i !== indexToRemove);
      if (filtered.length === 0) {
        // Nếu xoá hết thì thêm lại order mặc định để tránh lỗi
        return [
          {
            productId: null,
            quantity: null,
            price: null,
            name: null,
          },
        ];
      }
      return filtered;
    });
  };

  // Hàm xử lý khi chọn sản phẩm từ modal
  const handleOrderProduct = (e: {
    productId: number;
    orderIndex: number | null;
  }) => {
    const {productId, orderIndex} = e;

    if (orderIndex === null || orderIndex < 0 || orderIndex >= orders.length) {
      console.warn('orderIndex không hợp lệ');
      return;
    }

    setOrders(prev => {
      if (orderIndex === null || orderIndex < 0 || orderIndex >= prev.length) {
        return prev; // Bảo vệ nếu orderIndex không hợp lệ
      }

      // Kiểm tra productId đã tồn tại ở order nào chưa
      const existingOrderIndex = prev.findIndex(
        order => order.productId !== null && order.productId === productId - 1,
      );

      if (existingOrderIndex !== -1) {
        // Nếu đã tồn tại -> tăng quantity ở order đó
        const newOrders = [...prev];
        const existingOrder = newOrders[existingOrderIndex];

        newOrders[existingOrderIndex] = {
          ...existingOrder,
          quantity: (existingOrder.quantity ?? 0) + 1,
        };

        // Xóa order đang chọn nếu nó chưa có product
        const current = prev[orderIndex];
        if (current.productId === null) {
          newOrders.splice(orderIndex, 1);
        }

        return newOrders;
      } else {
        // Nếu chưa tồn tại -> gán productId vào order hiện tại
        const orderToUpdate = prev[orderIndex] || {
          productId: 0,
          quantity: 0,
          price: 0,
          name: '',
        };

        const updatedOrder = {
          ...orderToUpdate,
          productId: productId - 1,
          quantity: orderToUpdate.quantity ?? 1,
          price: products && products[productId - 1].price,
          name: products && products[productId - 1].name,
        };

        const newOrders = [...prev];
        newOrders[orderIndex] = updatedOrder;
        return newOrders;
      }
    });
    setModalVisible({modalStatus: false, orderIndex: null});
  };
  const updateQuantity = (index: number, type: 'increment' | 'decrement') => {
    setOrders(prev => {
      const order = prev[index];
      if (!order || order.quantity === null) {
        return prev;
      }

      const updatedOrder = {
        ...order,
        quantity:
          type === 'increment'
            ? order.quantity + 1
            : Math.max(1, order.quantity - 1),
      };

      const newOrders = [...prev];
      newOrders[index] = updatedOrder;
      return newOrders;
    });
  };

  const calculateTotal = (): number => {
    if (!products) {
      return 0;
    }

    return orders.reduce((total, order) => {
      if (
        order.productId !== null &&
        order.productId >= 0 &&
        products[order.productId] &&
        order.quantity !== null
      ) {
        const price = products[order.productId]?.price || 0;
        return total + price * order.quantity;
      }
      return total;
    }, 0);
  };

  const handleOrder = async () => {
    try {
      const db = await getDBConnection();
      const order = {
        total: calculateTotal(),
        payment: modalPayment.paymentTitle,
      };
      await createOrder(db, order, orders);
      setOrders([
        {
          productId: null,
          quantity: null,
          price: null,
          name: null,
        },
      ]);
      setModalPayment(prev => ({...prev, paymentTitle: ''}));
      Alert.alert(
        'Tạo Thành Công',
        'Sản phẩm đã được tạo',
        [
          {
            text: 'OK',
            onPress: () => console.log('Đã nhấn OK'),
          },
        ],
        {cancelable: true},
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="w-full h-full">
      <View className="flex flex-row items-center justify-between">
        <Text className="text-xl font-bold p-4">Home</Text>
        <View className="flex flex-row">
          <Text className="text-xl font-bold p-4">{getTodayWithWeekday()}</Text>
          <IconButton
            icon="application-cog-outline"
            iconColor="#000"
            size={24}
            onPress={() => navigation.navigate('Config')}
          />
        </View>
      </View>
      <ScrollView className="flex-1 mb-4" ref={scrollViewRef}>
        {orders &&
          orders.map((order, i) => {
            const selectedProduct =
              products &&
              order.productId !== null &&
              order.productId !== undefined
                ? products[order.productId]
                : undefined;

            return (
              <View key={i} className="w-full my-1">
                <SelectedOrder
                  updateQuantity={updateQuantity}
                  product={{product: selectedProduct, quantity: order.quantity}}
                  index={i}
                  handleOnDelete={handleDelete}
                  onOpenModal={() =>
                    setModalVisible({modalStatus: true, orderIndex: i})
                  }
                />
              </View>
            );
          })}
        <View className="flex items-center justify-center mb-4">
          <View className="bg-blue-400 rounded-full w-[65%] max-h-[35px] mt-2 flex items-center justify-center relative">
            <IconButton
              icon="plus"
              iconColor="#000"
              size={24}
              style={{width: '100%', height: '100%'}}
              onPress={addOrder}
            />
          </View>
        </View>
      </ScrollView>

      <View className="flex flex-row items-center justify-between">
        <View>
          <SelectedPayment
            title={modalPayment.paymentTitle}
            open={modalPayment.modalStatus}
            setModalPayment={setModalPayment}
          />
        </View>
        <View className="flex flex-col items-end justify-end gap-2 px-4">
          <Text className="font-bold uppercase">Thành tiền</Text>
          <Text className="text-[18px] text-red-600 font-semibold">
            {formatCurrency(calculateTotal())}
          </Text>
        </View>
      </View>

      <View className="px-[80px] my-2">
        <Button
          mode="contained"
          onPress={() => handleOrder()}
          disabled={
            orders[0].productId !== null && modalPayment.paymentTitle
              ? false
              : true
          }>
          <Text className="text-[17.5px]">Thanh Toán</Text>
        </Button>
      </View>

      {/* <View className="flex flex-row justify-around items-center border-t-2">
        <IconButton
          icon="application-cog-outline"
          iconColor="#000"
          size={24}
          onPress={() => navigation.navigate('Order')}
        />
        <IconButton
          icon="application-cog-outline"
          iconColor="#000"
          size={24}
          onPress={() => navigation.navigate('Product')}
        />
      </View> */}

      <ModalSelectProduct
        products={products}
        open={modalVisible.modalStatus}
        setModalVisible={setModalVisible}
        orderIndex={modalVisible.orderIndex}
        handleSelectProduct={handleOrderProduct}
      />
    </View>
  );
};

export default HomeScreen;
