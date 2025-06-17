import SQLite from 'react-native-sqlite-storage';

const tableApp = [
  {
    nameTable: 'products',
    query: `
          name TEXT NOT NULL UNIQUE,
          price REAL NOT NULL`,
  },
  {
    nameTable: 'orders',
    query: `
        total REAL NOT NULL,
        payment VARCHAR(100) NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
        `,
  },
  {
    nameTable: 'order_items',
    query: `
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    price_at_order REAL NOT NULL,
    name_at_order TEXT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  `,
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

export const migrateTables = async (
  db: SQLite.SQLiteDatabase,
  fromVersion: string,
  toVersion: string,
) => {
  console.log(`🚀 Migrating DB from version ${fromVersion} to ${toVersion}`);

  // Ví dụ: từ version 1 → 2 thì thêm cột `note` vào bảng `orders`
  if (toVersion === fromVersion + 1) {
    try {
      // await db.executeSql(`ALTER TABLE orders ADD COLUMN note TEXT`);
      // console.log(`✅ Migration ${fromVersion} → ${toVersion} complete`);
    } catch (err) {
      console.log('⚠️ Cột note đã tồn tại hoặc lỗi khác:', err);
    }
  }
};
