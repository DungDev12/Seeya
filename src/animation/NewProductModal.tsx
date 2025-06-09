import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {Button, IconButton, TextInput} from 'react-native-paper';
import {Product} from '../models/Product';
import {getDBConnection} from '../db/connectDB';
import {insertProduct} from '../repositories/ProductRepository';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type NewProductModalProps = {
  initTable: () => Promise<void>;
  status: {
    statusNewProduct: boolean;
    setStatusNewProduct: (value: boolean) => void;
  };
};

const NewProductModal = ({
  initTable,
  status,
}: NewProductModalProps): React.JSX.Element => {
  const translateY = useSharedValue(300);

  React.useEffect(() => {
    translateY.value = withTiming(status.statusNewProduct ? 0 : 300, {
      duration: 350,
    });
  }, [status.statusNewProduct, translateY]);

  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    price: 0,
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  const handleChange = (fieldName: keyof Product) => (e: any) => {
    const text = e.nativeEvent.text;
    setNewProduct(prev => ({
      ...prev,
      [fieldName]: text,
    }));
  };

  const createNewProduct = async (product: Product) => {
    try {
      const db = await getDBConnection();
      await insertProduct(db, {
        name: product.name,
        price: product.price * 1000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: '100%',
            bottom: 0,
            left: 0,
            padding: 8,
            backgroundColor: '#fff',
            zIndex: 10,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            boxShadow: `rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px`,
          },
          animatedStyle,
        ]}>
        <View className="flex-row h-[45px] items-center justify-between px-4">
          <Text className="text-[20px] font-bold uppercase">Tạo sản phẩm</Text>
          <IconButton
            iconColor="#000"
            icon="close"
            size={24}
            onPress={() => status.setStatusNewProduct(false)}
          />
        </View>

        <View className="mt-4">
          <TextInput
            mode="outlined"
            className="mb-2 rounded-none"
            label="Tên sản phẩm"
            value={newProduct.name}
            onChange={handleChange('name')}
          />
          <TextInput
            mode="outlined"
            className="mb-2 rounded-none"
            label="Giá"
            value={newProduct.price.toString()}
            keyboardType="numeric"
            right={<TextInput.Affix text=".000" />}
            onChange={e => {
              const text = e.nativeEvent.text;
              setNewProduct(prev => ({
                ...prev,
                price: parseFloat(text) || 0,
              }));
            }}
          />

          <Button
            onPress={async () => {
              //   console.log(newProduct);
              await createNewProduct(newProduct);
              await initTable();
              setNewProduct({name: '', price: 0});
              status.setStatusNewProduct(false);
            }}>
            <Text className="text-[18px]">Tạo</Text>
          </Button>
        </View>
      </Animated.View>
    </>
  );
};

export default NewProductModal;
