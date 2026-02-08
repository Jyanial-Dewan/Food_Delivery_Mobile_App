import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../modules/Home/Home';
import RestaurantDetail from '../modules/RestaurantDetail/RestaurantDetail';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeMain" component={Home} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetail} />
    </Stack.Navigator>
  );
};

export default HomeStack;
