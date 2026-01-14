import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../auth/LoginScreen';
import DrawerTabs from './DrawerTabs';

const {Navigator, Screen} = createStackNavigator();
const RootStack = () => {
  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name="LoginScreen" component={LoginScreen} />
      <Screen name="DrawerTabs" component={DrawerTabs} />
    </Navigator>
  );
};

export default RootStack;
