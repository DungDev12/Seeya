import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import ProductScreen from '../screens/ProductScreen';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

export interface allScreenProps {
  name: string;
  component: React.ComponentType<any>;
  options?: NativeStackNavigationOptions;
}

export type RootStackParamList = {
  Home: undefined;
  Detail: undefined;
  Product: undefined;
};

export const allScreen: allScreenProps[] = [
  {
    name: 'Home',
    component: HomeScreen,
  },
  {
    name: 'Product',
    component: ProductScreen,
    options: {
      presentation: 'modal',
      gestureEnabled: true,
    },
  },
];
