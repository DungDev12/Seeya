import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const getDBConnection = async (): Promise<SQLite.SQLiteDatabase> => {
  return SQLite.openDatabase({name: 'seeya.db', location: 'default'});
};
