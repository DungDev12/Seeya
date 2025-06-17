import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {DataTable, Text} from 'react-native-paper';
import {getOrderDetail} from '../../services/orderService';
import {getDBConnection} from '../../db/connectDB';
import {OrderHistory} from '../../models/Order';
import {OrderItem} from '../../models/OrderItem';
import {format} from 'date-fns';
import GoBackNavigateComponent from '../navigate/GoBackNavigateComponent';
import {formatCurrency} from '../../utils/format';

type OrderDetailProps = {
  route: {
    params: {
      id: number;
    };
  };
};

const OrderDetail: React.FC<OrderDetailProps> = ({route}) => {
  const {id} = route.params;

  const [data, setData] = useState<{
    order: OrderHistory | undefined;
    items: OrderItem[] | undefined;
  }>({
    order: undefined,
    items: undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = await getDBConnection();
        const result = await getOrderDetail(db, id);
        if (result) {
          setData({
            order: result.order,
            items: result.items,
          });
        }
      } catch (error) {
        console.error('Lỗi lấy dữ liệu đơn hàng:', error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <View className="w-full h-full bg-white">
      <GoBackNavigateComponent title="Chi tiết đơn hàng" />
      <View
        className="w-[90%] mx-auto p-4 flex-1"
        style={{
          padding: 8,
          borderRadius: 8,
          backgroundColor: '#fff',
          shadowColor: 'rgba(0, 0, 0, 0.65)',
          shadowOffset: {width: 0, height: 18},
          shadowOpacity: 0.8,
          shadowRadius: 24,
          elevation: 12,
          marginBottom: 16,
        }}>
        <FlatList
          className="border-b-[1.5px] border-black mb-4"
          data={data.items ?? []}
          keyExtractor={(item, index) =>
            item.id?.toString() ?? index.toString()
          }
          ListHeaderComponent={
            <View className="p-4">
              {data.order && (
                <View className="flex flex-row items-center justify-between border-b-[1.5px] border-black mb-4">
                  <Text className="text-lg font-semibold">
                    Mã: {data.order.id.toString().padStart(6, '0')}
                  </Text>
                  <Text>
                    {format(
                      new Date(data.order.created_at),
                      'dd/MM/yyyy HH:mm',
                    )}
                  </Text>
                </View>
              )}

              {/* Table Header */}
              <DataTable.Header>
                <DataTable.Title className="flex-1">STT</DataTable.Title>
                <DataTable.Title className="flex-1">Tên</DataTable.Title>
                <DataTable.Title className="flex-1 text-right">
                  Giá
                </DataTable.Title>
                <DataTable.Title className="flex-1 text-right">
                  Số lượng
                </DataTable.Title>
              </DataTable.Header>
            </View>
          }
          renderItem={({item, index}) => (
            <DataTable.Row className={`${index % 2 && 'bg-gray-200/80'}`}>
              <DataTable.Cell className="flex-1 flex items-center justify-center pr-6">
                <Text className="text-center font-bold">{index + 1}</Text>
              </DataTable.Cell>
              <DataTable.Cell className="flex-1">
                {item.name_at_order}
              </DataTable.Cell>
              <DataTable.Cell className="flex-1 text-right">
                {formatCurrency(item.price_at_order)}
              </DataTable.Cell>
              <DataTable.Cell className="flex-1 text-right">
                {item.quantity}
              </DataTable.Cell>
            </DataTable.Row>
          )}
        />
        {data.order && (
          <View className="flex flex-row items-center justify-around mb-2">
            <Text className="text-base font-bold">{data.order.payment}</Text>
            <Text
              className=" font-semibold text-base"
              style={{color: 'green', fontWeight: 700}}>
              {data.order.total.toLocaleString()} ₫
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default OrderDetail;
