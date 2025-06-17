import SQLite from 'react-native-sqlite-storage';
import {newOrder} from '../models/Order';

const insertOrder = async (
  db: SQLite.SQLiteDatabase,
  order: newOrder,
): Promise<number> => {
  const now = new Date().toISOString();
  const result = await db.executeSql(
    'INSERT INTO orders (total, payment, created_at) VALUES (?, ?, ?);',
    [order.total, order.payment, now],
  );

  return result[0].insertId;
};

const getAllDates = async (db: SQLite.SQLiteDatabase): Promise<string[]> => {
  const results = await db.executeSql(
    'SELECT DISTINCT DATE(created_at) as created_day FROM orders',
  );
  const rows = results[0].rows;
  const dates: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const item = rows.item(i);
    dates.push(item.created_day);
  }

  return dates;
};

const getAll = async (db: SQLite.SQLiteDatabase) => {
  const results = await db.executeSql('SELECT * FROM orders');
  const rows = results[0].rows;
  const orders: any[] = [];

  for (let i = 0; i < rows.length; i++) {
    orders.push(rows.item(i)); // 👈 lấy từng dòng
  }

  return orders;
};

const getOrdersByDate = (
  tx: SQLite.Transaction,
  date: string | undefined,
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    tx.executeSql(
      'SELECT * FROM orders WHERE created_at LIKE ?',
      [`${date}%`],
      (_, results) => {
        const orders: any[] = [];
        for (let i = 0; i < results.rows.length; i++) {
          const order = results.rows.item(i);
          // Chuyển created_at sang time
          const dateObj = new Date(order.created_at);
          order.time = dateObj.toLocaleTimeString('en-GB');
          orders.push(order);
        }
        resolve(orders);
      },
      (_, error) => {
        reject(error);
        return true;
      },
    );
  });
};

const getOrderById = async (db: SQLite.SQLiteDatabase, orderId: number) => {
  const result = await db.executeSql('SELECT * FROM orders WHERE id = ?', [
    orderId,
  ]);
  return result[0].rows.item(0);
};

export {insertOrder, getAllDates, getAll, getOrdersByDate, getOrderById};
