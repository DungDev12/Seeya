import SQLite from 'react-native-sqlite-storage';
import {newOrder} from '../models/Order';
import * as OrderRepository from '../repositories/OrderRepository';
import * as OrderItemRepository from '../repositories/OrderItemRepository';
import {NewOrderItem} from '../models/OrderItem';

const createOrder = async (
  db: SQLite.SQLiteDatabase,
  order: newOrder,
  items: NewOrderItem[],
) => {
  try {
    const orderId = await OrderRepository.insertOrder(db, order);
    console.log(orderId, items);
    for (const item of items) {
      await OrderItemRepository.insertOrderItem(db, orderId, item);
    }
  } catch (error) {
    throw new Error(`Lỗi không xác định: ${JSON.stringify(error)}`);
  }
};

const getAllOrderByDate = async (
  db: SQLite.SQLiteDatabase,
  date: string | undefined,
): Promise<any[]> => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction(async tx => {
        try {
          const orders = await OrderRepository.getOrdersByDate(tx, date);
          console.log('Orders trong ngày:', orders);
          resolve(orders);
        } catch (err) {
          reject(err);
        }
      });
    });
  } catch (error) {
    throw new Error('Lỗi không xác định');
  }
};

const getAllDatesOrder = async (
  db: SQLite.SQLiteDatabase,
): Promise<string[] | undefined> => {
  try {
    return await OrderRepository.getAllDates(db);
  } catch (error) {
    console.log(error);
  }
};

const testAllOrder = async (db: SQLite.SQLiteDatabase) => {
  try {
    return await OrderRepository.getAll(db);
  } catch (error) {
    console.log(error);
  }
};
const getOrderDetail = async (db: SQLite.SQLiteDatabase, orderId: number) => {
  try {
    const order = await OrderRepository.getOrderById(db, orderId);
    const items = await OrderItemRepository.getOrderItemsByOrderId(db, orderId);
    return {order, items};
  } catch (error) {
    console.log(error);
  }
};

export {
  createOrder,
  getAllDatesOrder,
  testAllOrder,
  getAllOrderByDate,
  getOrderDetail,
};
