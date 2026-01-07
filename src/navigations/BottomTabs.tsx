import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../modules/Home/Home';
import Profile from '../modules/Profile/Profile';

const {Navigator, Screen} = createBottomTabNavigator();
const BottomTabs = () => {
  return (
    <Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
      <Screen
        name="Home"
        component={Home}
        // options={{
        //   tabBarLabel: 'Home',
        //   tabBarLabelStyle: {display: 'none'},
        //   headerShown: false,
        //   tabBarIcon: ({focused, color}) => (
        //     <Icon name="home" size={26} color={focused ? color : 'black'} />
        //   ),
        // }}
      />
      <Screen
        name="Profile"
        component={Profile}
        // options={{
        //   tabBarLabel: 'Profile',
        //   tabBarLabelStyle: {display: 'none'},
        //   headerShown: false,
        //   tabBarIcon: ({focused, color}) => (
        //     <Icon
        //       name="account-circle"
        //       size={26}
        //       color={focused ? color : 'black'}
        //     />
        //   ),
        // }}
      />
    </Navigator>
  );
};

export default BottomTabs;
