import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {DataTable, IconButton, TextInput} from 'react-native-paper';
import {cssInterop} from 'react-native-css-interop';

import {getDBConnection} from '../db/connectDB';
import {Product} from '../models/Product';
import NewProductModal from '../animation/NewProductModal';
import {formatCurrency} from '../utils/format';
import EditProductModal from '../animation/EditProductModal';
import {getAllProducts} from '../services/productService';
import GoBackNavigateComponent from '../components/navigate/GoBackNavigateComponent';

cssInterop(DataTable.Header, {className: 'style'});
cssInterop(DataTable.Title, {className: 'style'});
cssInterop(DataTable.Cell, {className: 'style'});
cssInterop(DataTable.Row, {className: 'style'});
cssInterop(TextInput, {className: 'style'});

const ProductScreen = () => {
  const [statusModal, setStatusModal] = useState<{
    open: boolean;
    productIndex?: number;
  }>({
    open: false,
    productIndex: undefined,
  });

  const [statusNewProduct, setStatusNewProduct] = useState<boolean>(false);

  const [products, setProducts] = useState<Product[] | undefined>([]);

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
      <GoBackNavigateComponent title="Danh sách sản phẩm" />
      <ScrollView className="flex-1 mb-4">
        <DataTable>
          <DataTable.Header>
            <DataTable.Title className="flex-2">Tên</DataTable.Title>
            <DataTable.Title className="flex-1 text-right">Giá</DataTable.Title>
            <DataTable.Title>{''}</DataTable.Title>
          </DataTable.Header>

          {products &&
            products.map((product, i) => (
              <DataTable.Row
                key={product.id?.toString() ?? i.toString()}
                className={`${i % 2 && 'bg-gray-200/80'}`}>
                <DataTable.Cell className="flex-2">
                  {product.name}
                </DataTable.Cell>
                <DataTable.Cell className="flex-1 text-right">
                  {formatCurrency(product.price)}
                </DataTable.Cell>
                <DataTable.Cell className="w-[80px] flex items-center justify-center flex-row">
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() =>
                      setStatusModal({open: true, productIndex: i})
                    }
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
      <EditProductModal
        visible={statusModal.open}
        setStatusModal={setStatusModal}
        product={
          products && statusModal.productIndex !== undefined
            ? products[statusModal.productIndex]
            : undefined
        }
        initTable={initTable}
      />
    </View>
  );
};

export default ProductScreen;
