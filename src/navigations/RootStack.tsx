import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabs from './BottomTabs';

const {Navigator, Screen} = createStackNavigator();
const RootStack = () => {
  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name="BottomTabs" component={BottomTabs} />
      {/* <Screen name="Profile" component={Profile} /> */}
    </Navigator>
  );
};

export default RootStack;
