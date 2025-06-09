import SQLite from 'react-native-sqlite-storage';

const tableApp = [
  {
    nameTable: 'products',
    query: `
          name TEXT NOT NULL,
          price REAL NOT NULL`,
  },
  {
    nameTable: 'orders',
    query: `
        total REAL NOT NULL`,
  },
  {
    nameTable: 'order_items',
    query: `
      order_id INTEGER,
      product_id INTEGER,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)`,
  },
];

export const createTables = async (db: SQLite.SQLiteDatabase) => {
  await createTable(db, tableApp);
};

interface createTableProps {
  nameTable: string;
  query: string;
}
async function createTable(
  db: SQLite.SQLiteDatabase,
  tables: createTableProps[],
) {
  for (const table of tables) {
    const sql = `CREATE TABLE IF NOT EXISTS ${table.nameTable} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ${table.query}
    );`;
    await db.executeSql(sql);
  }
  console.log('Create Table Success');
}
