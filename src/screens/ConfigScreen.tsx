import {View} from 'react-native';
import GoBackNavigateComponent from '../components/navigate/GoBackNavigateComponent';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../routes/routes';
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Config'
>;
const ConfigScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  return (
    <View className="w-full h-full relative">
      <GoBackNavigateComponent title="Cấu hình" />

      <View>
        <Button onPress={() => navigation.navigate('Product')}>
          Danh sách sản phẩm
        </Button>
        <Button onPress={() => navigation.navigate('Order')}>Lịch sử</Button>
      </View>
    </View>
  );
};

export default ConfigScreen;
