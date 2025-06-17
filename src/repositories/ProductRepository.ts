import SQLite from 'react-native-sqlite-storage';
import {Product} from '../models/Product';

const insertProduct = async (db: SQLite.SQLiteDatabase, product: Product) => {
  await db.executeSql('INSERT INTO products (name,price) VALUES (?,?)', [
    product.name,
    product.price,
  ]);
};

const getAllProducts = async (
  db: SQLite.SQLiteDatabase,
): Promise<Product[]> => {
  const results = await db.executeSql('SELECT * FROM products');
  const rows = results[0].rows;
  const products: Product[] = [];

  for (let i = 0; i < rows.length; i++) {
    products.push(rows.item(i));
  }
  return products;
};

const updateProduct = async (db: SQLite.SQLiteDatabase, product: Product) => {
  await db.executeSql('UPDATE products SET name = ? , price = ? WHERE id = ?', [
    product.name,
    product.price,
    product.id,
  ]);
};

const deleteProductByID = async (
  db: SQLite.SQLiteDatabase,
  productId: number,
) => {
  await db.executeSql('DELETE FROM products WHERE id = ?', [productId]);
};

export {insertProduct, getAllProducts, updateProduct, deleteProductByID};
