import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import ProductScreen from '../screens/ProductScreen';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import OrderScreen from '../screens/OrderScreen';
import OrderDetail from '../components/order/OrderDetail';
import ConfigScreen from '../screens/ConfigScreen';

export interface allScreenProps {
  name: string;
  component: React.ComponentType<any>;
  options?: NativeStackNavigationOptions;
}

export type RootStackParamList = {
  Home: undefined;
  Product: undefined;
  Order: undefined;
  OrderDetail: {
    id: number;
  };
  Config: undefined;
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
  {
    name: 'Order',
    component: OrderScreen,
  },
  {
    name: 'OrderDetail',
    component: OrderDetail,
  },
  {
    name: 'Config',
    component: ConfigScreen,
  },
];
