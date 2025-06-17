import React, {Dispatch, SetStateAction} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Product} from '../../models/Product';
import {formatCurrency} from '../../utils/format';
import {IconButton} from 'react-native-paper';

type SelectedOrderProps = {
  product: {product: Product | undefined; quantity: number | null};
  index: number;
  handleOnDelete: (number: number) => void;
  onOpenModal: Dispatch<
    SetStateAction<{modalStatus: boolean; orderIndex: number | null}>
  >;
  updateQuantity: (index: number, type: 'increment' | 'decrement') => void;
};

const SelectedOrder: React.FC<SelectedOrderProps> = ({
  product,
  index,
  handleOnDelete,
  onOpenModal,
  updateQuantity,
}) => {
  return (
    <View>
      <View className="flex flex-row items-center gap-4 px-4 py-2">
        <TouchableOpacity
          disabled={product.product ? true : false}
          className="flex-1"
          onPress={() => onOpenModal({modalStatus: true, orderIndex: index})}>
          <Text
            className={`${product.product ? '' : 'text-center font-bold '}`}>
            {product.product ? `${product.product?.name}` : 'Chọn sản phẩm'}
          </Text>
        </TouchableOpacity>
        {/* Quantity */}
        {product.product && (
          <View className="flex flex-row items-center space-x-4 gap-2">
            {product && product.quantity !== null && product.quantity > 1 && (
              <TouchableOpacity
                className="px-3 py-1 rounded"
                onPress={() => updateQuantity(index, 'decrement')}>
                <Text className="text-xl">−</Text>
              </TouchableOpacity>
            )}
            <Text className="text-base">{product.quantity}</Text>
            <TouchableOpacity
              className="px-3 py-1 rounded"
              onPress={() => updateQuantity(index, 'increment')}>
              <Text className="text-xl">+</Text>
            </TouchableOpacity>
          </View>
        )}
        {product.product && (
          <Text>
            {formatCurrency(
              (product.product?.price ?? 0) * (product.quantity ?? 0),
            )}
          </Text>
        )}

        <IconButton
          icon={'trash-can-outline'}
          iconColor="#000"
          onPress={() => handleOnDelete(index)}
        />
      </View>
    </View>
  );
};

export default SelectedOrder;
