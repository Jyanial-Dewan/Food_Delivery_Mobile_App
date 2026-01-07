import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
import Profile from '../modules/Profile/Profile';

const {Navigator, Screen} = createDrawerNavigator();

const DrawerTabs = () => {
  return (
    <Navigator
      // initialRouteName="BottomTabs"
      screenOptions={{headerShown: false}}>
      {/* <Screen name="BottomTabs" component={BottomTabs} /> */}
      <Screen name="Profile" component={Profile} />
    </Navigator>
  );
};

export default DrawerTabs;
