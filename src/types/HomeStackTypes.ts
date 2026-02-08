import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export interface NavigationStackParamList {
  [key: string]: undefined | object;
  RestaurantDetail: {restaurantId: number};
}

export type RestaurantDetailNavigationProp = NativeStackNavigationProp<
  NavigationStackParamList,
  'RestaurantDetail'
>;
