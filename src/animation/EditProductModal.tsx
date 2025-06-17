import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View as RNView,
} from 'react-native';
import {Button, IconButton, TextInput} from 'react-native-paper';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';

import {getDBConnection} from '../db/connectDB';
import {deleteProductByID, updateProduct} from '../services/productService';
type EditProductType = {
  id?: number;
  name?: string;
  price: string | number;
};

type EditProductModalProps = {
  visible: boolean;
  setStatusModal: React.Dispatch<
    React.SetStateAction<{open: boolean; productIndex?: number}>
  >;
  product?: EditProductType;
  initTable: () => Promise<void>;
};

const EditProductModal: React.FC<EditProductModalProps> = ({
  visible,
  setStatusModal,
  product,
  initTable,
}) => {
  // Shared values for animation
  const fade = useSharedValue(0);
  const translateY = useSharedValue(50);

  const [editProduct, setEditProduct] = useState<EditProductType>({
    id: 0,
    name: '',
    price: '',
  });

  useEffect(() => {
    if (visible && product) {
      setEditProduct({
        id: product.id,
        name: product.name ?? '',
        price:
          typeof product.price === 'number'
            ? (product.price / 1000).toString()
            : product.price ?? '',
      });
    }
  }, [visible, product]);

  useEffect(() => {
    if (visible) {
      fade.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      translateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
    } else {
      fade.value = withTiming(0, {duration: 200});
      translateY.value = withTiming(50, {duration: 200});
    }
  }, [visible, translateY, fade]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  if (!visible) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Animated.View
        style={backdropStyle}
        className="absolute w-full h-full bg-gray-500/55 top-0 left-0 flex items-center justify-center">
        <Animated.View
          style={modalStyle}
          className="flex flex-col bg-white w-[80%] h-[250px] rounded-[8px] p-2">
          <RNView className="flex flex-row items-center mb-2">
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => setStatusModal(prev => ({...prev, open: false}))}
            />
            <Text className="text-center text-[16px] uppercase font-bold">
              Cập nhật sản phẩm
            </Text>
          </RNView>

          <RNView className="flex-1">
            <TextInput
              mode="outlined"
              className="mb-2 rounded-none"
              label="Tên sản phẩm"
              value={editProduct.name}
              onChange={e => {
                const text = e.nativeEvent.text;
                setEditProduct(prev => ({...prev, name: text}));
              }}
            />
            <TextInput
              mode="outlined"
              className="mb-2 rounded-none"
              label="Giá"
              value={
                typeof editProduct.price === 'number'
                  ? editProduct.price.toString()
                  : editProduct.price ?? ''
              }
              onChange={e => {
                const text = e.nativeEvent.text;
                setEditProduct(prev => ({
                  ...prev,
                  price: text,
                }));
              }}
            />
          </RNView>

          <RNView className="flex flex-row mt-1 items-center justify-center">
            <Button className="flex-1">
              <Text
                className="text-red-600"
                onPress={async () => {
                  if (product?.id !== undefined) {
                    const db = await getDBConnection();
                    await deleteProductByID(db, product.id);
                    setStatusModal({open: false});
                    await initTable();
                  } else {
                    console.warn('Không tìm thấy ID sản phẩm để xoá');
                  }
                }}>
                Xoá
              </Text>
            </Button>
            <Button
              className="flex-1"
              onPress={async () => {
                if (
                  editProduct.id !== undefined &&
                  editProduct.name &&
                  editProduct.price
                ) {
                  const db = await getDBConnection();

                  await updateProduct(db, {
                    id: editProduct.id,
                    name: editProduct.name,
                    price: parseFloat(editProduct.price.toString()) * 1000,
                  });

                  setStatusModal({open: false});
                  await initTable();
                } else {
                  console.warn('Thiếu thông tin sản phẩm để cập nhật');
                }
              }}>
              Cập nhật
            </Button>
          </RNView>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default EditProductModal;
