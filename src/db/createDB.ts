import AsyncStorage from '@react-native-async-storage/async-storage';
import {createTables, migrateTables} from './tables';
import {getDBConnection} from './connectDB';

const CURRENT_DB_VERSION = '1'; // 👉 tăng mỗi lần bạn thay đổi cấu trúc DB

const initDB = async () => {
  try {
    const savedVersion = await AsyncStorage.getItem('DB_VERSION');

    const db = await getDBConnection();

    if (!savedVersion) {
      // Lần cài đặt đầu tiên
      await createTables(db);
      await AsyncStorage.setItem('DB_VERSION', CURRENT_DB_VERSION);
      console.log('✅ Database đã khởi tạo lần đầu!');
    } else if (savedVersion !== CURRENT_DB_VERSION) {
      // DB có thể cần cập nhật
      await migrateTables(db, savedVersion, CURRENT_DB_VERSION);
      await AsyncStorage.setItem('DB_VERSION', CURRENT_DB_VERSION);
      console.log(
        `✅ DB updated from version ${savedVersion} → ${CURRENT_DB_VERSION}`,
      );
    } else {
      console.log('✅ DB đã có, không cần cập nhật');
    }
  } catch (e) {
    console.error('❌ initDB error:', e);
  }
};

export {initDB};
