import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Button, Text, View} from 'react-native';
import {RootStackParamList} from '../routes/routes';
import {useNavigation} from '@react-navigation/native';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const HomeScreen = (): React.JSX.Element => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View>
      <Text>Home</Text>
      <Button
        title="Go to Detail"
        onPress={() => navigation.navigate('Product')}
      />
    </View>
  );
};

export default HomeScreen;
