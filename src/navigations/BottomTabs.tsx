import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../modules/Home/Home';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TrackOrder from '../modules/TrackOrder/TrackOrder';
import Cart from '../modules/Cart/Cart';
import Notification from '../modules/Notification/Notification';
import Favorite from '../modules/Favorite/Favorite';
import {COLORS} from '../common/constant/Themes';
import {useTheme} from 'react-native-paper';

const {Navigator, Screen} = createBottomTabNavigator();
const BottomTabs = () => {
  const theme = useTheme();
  return (
    <Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.background,
        },
      }}>
      <Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarLabelStyle: {display: 'none'},
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Icon
              name="home"
              size={26}
              color={focused ? COLORS.green : 'gray'}
            />
          ),
        }}
      />
      <Screen
        name="TrackOrder"
        component={TrackOrder}
        options={{
          tabBarLabel: 'Track Order',
          tabBarLabelStyle: {display: 'none'},
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Icon
              name="truck"
              size={26}
              color={focused ? COLORS.green : 'gray'}
            />
          ),
        }}
      />
      <Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarLabel: 'Cart',
          tabBarLabelStyle: {display: 'none'},
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Icon
              name="cart"
              size={26}
              color={focused ? COLORS.green : 'gray'}
            />
          ),
        }}
      />
      <Screen
        name="Favorite"
        component={Favorite}
        options={{
          tabBarLabel: 'Favorite',
          tabBarLabelStyle: {display: 'none'},
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Icon
              name="heart"
              size={26}
              color={focused ? COLORS.green : 'gray'}
            />
          ),
        }}
      />
      <Screen
        name="Notification"
        component={Notification}
        options={{
          tabBarLabel: 'Notification',
          tabBarLabelStyle: {display: 'none'},
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Icon
              name="bell"
              size={26}
              color={focused ? COLORS.green : 'gray'}
            />
          ),
        }}
      />
    </Navigator>
  );
};

export default BottomTabs;
