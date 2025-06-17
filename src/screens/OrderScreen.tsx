import {FlatList, Text, View} from 'react-native';
import CalendarScreenComponent from '../components/calendar/CalendarScreenComponent';
import OrderCard from '../components/order/OrderCard';
import {useEffect, useState} from 'react';
import {getDBConnection} from '../db/connectDB';
import {getAllOrderByDate} from '../services/orderService';
import {OrderHistory} from '../models/Order';
import {getDate} from '../utils/date';
import GoBackNavigateComponent from '../components/navigate/GoBackNavigateComponent';

const OrderScreen = () => {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [selectedDate, setSelectedDate] = useState(getDate('YYYY-MM-DD'));
  const getOrders = async (date: string | undefined) => {
    try {
      setSelectedDate(date);
      const db = await getDBConnection();
      const data = await getAllOrderByDate(db, date);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders(selectedDate);
  }, [selectedDate]);

  return (
    <View className="flex flex-1">
      <View className="flex flex-row items-center justify-between pr-4">
        <GoBackNavigateComponent title="Lịch sử" />
        <CalendarScreenComponent
          handleGetOrders={getOrders}
          selectedDate={selectedDate}
        />
      </View>
      {orders?.length > 0 ? (
        <FlatList
          contentContainerStyle={{paddingHorizontal: 16}}
          data={orders}
          keyExtractor={item => item.id.toString()}
          renderItem={({item, index}) => (
            <View
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: '#fff',
                shadowColor: 'rgba(0, 0, 0, 0.55)',
                shadowOffset: {width: 0, height: 12},
                shadowOpacity: 0.8,
                shadowRadius: 24,
                elevation: 12, // Android
                marginBottom: 16,
              }}>
              <OrderCard
                index={index + 1}
                code={item.id}
                time={item.time}
                total={item.total}
                payment={item.payment}
              />
            </View>
          )}
        />
      ) : (
        <View className="mt-2">
          <Text className="text-center font-bold text-[18px]">
            Không có dữ liệu
          </Text>
        </View>
      )}
    </View>
  );
};

export default OrderScreen;
