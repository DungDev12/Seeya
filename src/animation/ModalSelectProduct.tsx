import {FlatList, Modal, Text, TouchableOpacity, View} from 'react-native';
import {formatCurrency} from '../utils/format';
import {Product} from '../models/Product';
import React, {Dispatch, SetStateAction} from 'react';

type ModalSelectProductTypes = {
  products: Product[] | undefined;
  open: boolean;
  setModalVisible: Dispatch<
    SetStateAction<{modalStatus: boolean; orderIndex: number | null}>
  >;
  orderIndex: number | null;
  handleSelectProduct: (params: {
    productId: number;
    orderIndex: number | null;
  }) => void;
};

const ModalSelectProduct: React.FC<ModalSelectProductTypes> = ({
  products,
  open,
  setModalVisible,
  orderIndex,
  handleSelectProduct,
}) => {
  return (
    <Modal visible={open} animationType="fade" transparent>
      <View className="relative w-full h-full bg-black/40">
        <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl  min-w-[280px] max-w-[400px] p-4 shadow-md">
          <Text className="text-lg font-semibold mb-2">Chọn sản phẩm</Text>

          <View className="max-w-[350px] h-full max-h-[300px]">
            <FlatList
              data={products}
              keyExtractor={item => item.name}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <TouchableOpacity
                  className="flex my-1 flex-row justify-between items-center py-2 border-b border-gray-200"
                  onPress={() =>
                    handleSelectProduct({
                      productId: item.id as number,
                      orderIndex,
                    })
                  }>
                  <Text
                    className="flex-1 text-sm text-gray-800 text-[15.5px]"
                    numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="text-sm text-gray-600 ml-2 whitespace-nowrap">
                    {formatCurrency(item.price)} VNĐ
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <TouchableOpacity
            className="mt-4 bg-gray-200 rounded px-4 py-2 self-center"
            onPress={() =>
              setModalVisible({modalStatus: false, orderIndex: null})
            }>
            <Text className="text-gray-700 font-medium">Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalSelectProduct;
