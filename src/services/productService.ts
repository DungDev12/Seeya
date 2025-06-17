import SQLite from 'react-native-sqlite-storage';
import {Product} from '../models/Product';
import * as ProductRepository from '../repositories/ProductRepository';
import {isSQLiteError} from '../utils/errorSQL';

const createProduct = async (db: SQLite.SQLiteDatabase, product: Product) => {
  try {
    await ProductRepository.insertProduct(db, product);
  } catch (error) {
    if (isSQLiteError(error)) {
      switch (error.code) {
        case 0:
          throw new Error('Trùng dữ liệu: sản phẩm đã tồn tại.');
        default:
          throw new Error(error.message);
      }
    } else {
      throw new Error('Lỗi không xác định');
    }
  }
};

const updateProduct = async (db: SQLite.SQLiteDatabase, product: Product) => {
  try {
    await ProductRepository.updateProduct(db, product);
  } catch (error) {
    console.log(error);
  }
};

const deleteProductByID = async (db: SQLite.SQLiteDatabase, id: number) => {
  try {
    await ProductRepository.deleteProductByID(db, id);
  } catch (error) {
    console.log(error);
  }
};

const getAllProducts = async (
  db: SQLite.SQLiteDatabase,
): Promise<Product[] | undefined> => {
  try {
    return await ProductRepository.getAllProducts(db);
  } catch (error) {
    console.log(error);
  }
};

export {createProduct, updateProduct, deleteProductByID, getAllProducts};
