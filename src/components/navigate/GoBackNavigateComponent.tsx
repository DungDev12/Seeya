import {useNavigation} from '@react-navigation/native';
import {Text, View} from 'react-native';
import {IconButton} from 'react-native-paper';

type GoBackNavigateComponentProps = {
  title: string;
};

const GoBackNavigateComponent: React.FC<GoBackNavigateComponentProps> = ({
  title,
}) => {
  const navigation = useNavigation();
  return (
    <>
      <View className="flex flex-row items-center mb-2">
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text className="text-xl font-bold">{title}</Text>
      </View>
    </>
  );
};

export default GoBackNavigateComponent;
