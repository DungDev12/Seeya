import SQLite from 'react-native-sqlite-storage';
import {NewOrderItem, OrderItem} from '../models/OrderItem';

const insertOrderItem = async (
  db: SQLite.SQLiteDatabase,
  orderId: number,
  item: NewOrderItem,
): Promise<void> => {
  const [res] = await db.executeSql(
    `INSERT INTO order_items (order_id, product_id, quantity, price_at_order, name_at_order)
     VALUES (?, ?, ?, ?, ?)`,
    [orderId, item.productId, item.quantity, item.price, item.name],
  );
  console.log(res);
};

const getOrderItemsByOrderId = async (
  db: SQLite.SQLiteDatabase,
  orderId: number,
) => {
  const results = await db.executeSql(
    'SELECT * FROM order_items WHERE order_id = ?',
    [orderId],
  );

  const rows = results[0].rows;
  const items: OrderItem[] = [];

  for (let i = 0; i < rows.length; i++) {
    items.push(rows.item(i));
  }
  return items;
};

export {insertOrderItem, getOrderItemsByOrderId};
