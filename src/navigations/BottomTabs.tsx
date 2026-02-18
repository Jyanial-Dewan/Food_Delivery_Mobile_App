import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TrackOrder from '../modules/TrackOrder/TrackOrder';
import Cart from '../modules/Cart/Cart';
import Notification from '../modules/Notification/Notification';
import {COLORS} from '../common/constant/Themes';
import {useTheme} from 'react-native-paper';
import Scanner from '../modules/Scanner/Scanner';
import HomeStack from './HomeStack';
import {useSelector} from 'react-redux';
import {RootState} from '../stores/Redux/Store/Store';

const {Navigator, Screen} = createBottomTabNavigator();
const BottomTabs = () => {
  const cart = useSelector((state: RootState) => state.cart.cart);
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
        component={HomeStack}
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
          tabBarBadge: cart.length,
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
        component={Scanner}
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
