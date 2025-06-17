import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {RootStackParamList} from '../../routes/routes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type OrderCard = {
  index: number;
  time: string;
  total: number;
  payment: string;
  code: number;
};
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrderDetail'
>;
const OrderCard: React.FC<OrderCard> = ({
  index,
  time,
  total,
  payment,
  code,
}) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('OrderDetail', {id: code})}>
      <View className="p-2 flex flex-row items-center justify-between">
        {/* Left: Số thứ tự */}
        <Text className="text-base font-bold text-gray-800 w-6 text-center">
          {index}
        </Text>

        {/* Middle: Mã đơn + Giờ + Ngày */}
        <View className="flex-1 ml-4">
          <View className="flex flex-col justify-between">
            <Text className="text-gray-600 text-sm">Giờ: {time}</Text>
            <Text className="text-gray-600 text-sm">
              Mã: {code.toString().padStart(6, '0')}
            </Text>
          </View>
        </View>

        {/* Right: Tổng tiền + payment */}
        <View className="items-end">
          <Text className="text-green-600 font-semibold text-base">
            {total?.toLocaleString()} ₫
          </Text>
          <Text className="text-xs text-gray-500">{payment}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;
