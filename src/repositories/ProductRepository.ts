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

const updateProductById = async (
  db: SQLite.SQLiteDatabase,
  product: Product,
) => {
  try {
    await db.executeSql(
      'UPDATE products SET name = ? , price = ? WHERE id = ?',
      [product.name, product.price, product.id],
    );
  } catch (error) {
    console.error('Update product error:', error);
  }
};

export {insertProduct, getAllProducts, updateProductById};
