import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Button, DataTable, IconButton, TextInput} from 'react-native-paper';
import {cssInterop} from 'react-native-css-interop';

import {getDBConnection} from '../db/connectDB';
import {getAllProducts} from '../repositories/ProductRepository';
import {Product} from '../models/Product';
import {useNavigation} from '@react-navigation/native';
import NewProductModal from '../animation/NewProductModal';
import {formatCurrency} from '../utils/format';

cssInterop(DataTable.Header, {className: 'style'});
cssInterop(DataTable.Title, {className: 'style'});
cssInterop(DataTable.Cell, {className: 'style'});
cssInterop(DataTable.Row, {className: 'style'});
cssInterop(TextInput, {className: 'style'});

const ProductScreen = () => {
  const navigate = useNavigation();

  const [statusModal, setStatusModal] = useState<{
    open: boolean;
    productIndex?: number;
  }>({
    open: false,
    productIndex: undefined,
  });

  const [statusNewProduct, setStatusNewProduct] = useState<boolean>(false);

  const [products, setProducts] = useState<Product[]>([]);

  const initTable = async () => {
    try {
      const db = await getDBConnection();
      const data = await getAllProducts(db);
      setProducts(data);
    } catch (e) {
      console.error('initTable error:', e);
    }
  };
  useEffect(() => {
    initTable();
  }, []);

  return (
    <View className="w-full h-full relative">
      <View className="flex flex-row items-center mb-2">
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigate.goBack()}
        />
        <Text className="text-xl font-bold">Danh sách sản phẩm</Text>
      </View>
      <ScrollView className="flex-1 mb-4">
        <DataTable>
          <DataTable.Header>
            <DataTable.Title className="flex-2">Tên</DataTable.Title>
            <DataTable.Title className="flex-1 text-right">Giá</DataTable.Title>
            <DataTable.Title>{''}</DataTable.Title>
          </DataTable.Header>

          {products.map((product, i) => (
            <DataTable.Row
              key={product.id?.toString() ?? i.toString()}
              className={`${i % 2 && 'bg-gray-200/80'}`}>
              <DataTable.Cell className="flex-2">{product.name}</DataTable.Cell>
              <DataTable.Cell className="flex-1 text-right">
                {formatCurrency(product.price)}
              </DataTable.Cell>
              <DataTable.Cell className="w-[80px] flex items-center justify-center flex-row">
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => setStatusModal({open: true, productIndex: i})}
                />
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>

      {/* Nút cố định dưới cùng */}
      <View
        className={`${
          statusNewProduct ? 'hidden' : 'flex'
        } h-[45px] items-end justify-center bg-gray-100`}>
        <IconButton
          className="w-full h-full bg-gray-300/80 rounded-full border-[1.5px] border-black"
          iconColor="#000"
          icon="plus"
          size={24}
          onPress={() => setStatusNewProduct(true)}
        />
      </View>

      {/* Tạo sản phẩm*/}
      <NewProductModal
        initTable={initTable}
        status={{statusNewProduct, setStatusNewProduct}}
      />

      {/* Sửa Xoá sản phẩm */}
      <View className="absolute w-full h-full bg-gray-500/55 top-0 left-0 flex items-center justify-center">
        <View className="flex flex-col bg-white w-[80%] h-[250px] rounded-[8px] p-2">
          <View className="flex flex-row items-center mb-2">
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => setStatusModal({open: false})}
            />
            <Text className="text-center text-[16px] uppercase font-bold">
              Cập nhật sản phẩm
            </Text>
          </View>

          <View className="flex-1">
            <TextInput
              mode="outlined"
              className="mb-2 rounded-none"
              label="Tên sản phẩm"
              placeholder="Test"
            />
            <TextInput
              mode="outlined"
              className="mb-2 rounded-none"
              label="Giá"
              placeholder="Test"
            />
          </View>

          <View className="flex flex-row mt-1 items-center justify-center">
            <Button className="flex-1">
              <Text className="text-red-600">Xoá</Text>
            </Button>
            <Button className="flex-1">Cập nhật</Button>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProductScreen;
