import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {secureStorage} from '../utils/Storage/mmkv';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../stores/Redux/Slices/UserSlice';
import {Avatar, Switch, useTheme} from 'react-native-paper';
import {setTheme} from '../stores/Redux/Slices/ThemeSlice';
import MyAccount from '../modules/MyAccount/MyAccount';
import MyOrders from '../modules/MyOrders/MyOrders';
import Settings from '../modules/Settings/Settings';
import Subscription from '../modules/Subscription/Subscription';
import Address from '../modules/Address/Address';
import Payment from '../modules/Payment/Payment';
import {BaseURL} from '../../App';
import EditMyAccount from '../modules/MyAccount/EditMyAccount';

const {Navigator, Screen} = createDrawerNavigator();
const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const theme = useTheme();
  const activeRoute = props.state.routes[props.state.index];
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  const handleLogOut = () => {
    secureStorage.removeItem('user_token');
    dispatch(logout());
    props.navigation.reset({
      index: 0,
      routes: [{name: 'LoginScreen'}],
    });
    // console.log('logout');
  };

  const isActive = (routeName: string) => {
    return activeRoute.name === routeName;
  };

  const links = [
    {
      name: 'My Account',
      icon: 'account',
      screen: 'MyAccount',
    },
    {
      name: 'My Orders',
      icon: 'cart',
      screen: 'MyOrders',
    },
    {
      name: 'Payment',
      icon: 'cash',
      screen: 'Payment',
    },
    {
      name: 'Address',
      icon: 'map',
      screen: 'Address',
    },
    {
      name: 'Subscription',
      icon: 'auto-fix',
      screen: 'Subscription',
    },
    {
      name: 'Settings',
      icon: 'tools',
      screen: 'Settings',
    },
    {
      name: 'Log Out',
      icon: 'logout',
      screen: 'LogOut',
    },
  ];

  const handleThemeChange = () => {
    dispatch(setTheme(theme.dark ? 'light' : 'dark'));
    secureStorage.setItem('theme', theme.dark ? 'light' : 'dark');
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={{gap: 10}}>
        <View style={styles.header}>
          <Avatar.Image
            style={[styles.avatar, {backgroundColor: theme.colors.secondary}]}
            size={70}
            source={{uri: `${BaseURL}/${user?.profile_image_thumbnail}`}}
          />
          <View style={{gap: 3}}>
            <Text style={[styles.headerText, {color: theme.colors.surface}]}>
              {user?.first_name} {user?.last_name}
            </Text>
            <Text style={[styles.headerSubText, {color: theme.colors.surface}]}>
              {user?.email}
            </Text>
            <View style={styles.premiumBadge}>
              <MaterialCommunityIcon name="star" size={14} color={'orange'} />
              <Text
                style={[styles.headerSubText, {color: theme.colors.surface}]}>
                Premium
              </Text>
            </View>
          </View>
        </View>
        {/* <View style={styles.mode}>
        <TouchableOpacity onPress={handleThemeChange}>
          <MaterialCommunityIcon
            name={theme.dark ? 'white-balance-sunny' : 'weather-night'}
            size={22}
            color={theme.dark ? 'orange' : 'black'}
          />
        </TouchableOpacity>
      </View> */}
        <Text style={[styles.text, {color: theme.colors.surface}]}>
          General
        </Text>
        <View style={{}}>
          {links.map((link, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                link.screen === 'LogOut'
                  ? handleLogOut()
                  : props.navigation.navigate(link.screen)
              }
              style={[
                styles.link,
                isActive(link.screen) && {
                  backgroundColor: theme.colors.primary,
                },
                {backgroundColor: theme.colors.secondary},
              ]}>
              <View style={styles.linkContent}>
                <MaterialCommunityIcon
                  name={link.icon}
                  size={22}
                  color={theme.colors.surface}
                />
                <Text
                  style={[
                    styles.text,
                    isActive(link.screen) && styles.activeText,
                    {color: theme.colors.surface},
                  ]}>
                  {link.name}
                </Text>
              </View>
              {index !== links.length - 1 && (
                <MaterialCommunityIcon
                  name="chevron-right"
                  size={22}
                  color={theme.colors.surface}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.text, {color: theme.colors.surface}]}>Theme</Text>
        <View style={{gap: 10}}>
          <View
            style={[styles.link, {backgroundColor: theme.colors.secondary}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <MaterialCommunityIcon
                name={theme.dark ? 'white-balance-sunny' : 'weather-night'}
                size={22}
                color={theme.dark ? 'black' : 'orange'}
              />
              <Text style={[styles.text, {color: theme.colors.surface}]}>
                {theme.dark ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Switch value={theme.dark} onValueChange={handleThemeChange} />
          </View>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};
const DrawerTabs = () => {
  const theme = useTheme();
  return (
    <Navigator
      initialRouteName="BottomTabs"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        lazy: true,
        swipeEdgeWidth: 0,
        drawerActiveTintColor: 'white',
        drawerActiveBackgroundColor: '#003CB3',
        drawerLabelStyle: {
          color: 'green',
        },
        drawerStyle: {
          backgroundColor: theme.colors.background,
          padding: 10,
        },
        drawerContentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}>
      <Screen
        name="BottomTabs"
        component={BottomTabs}
        options={{
          headerShown: false,
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Screen
        name="MyAccount"
        component={MyAccount}
        options={{
          headerShown: false,
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Screen
        name="EditMyAccount"
        component={EditMyAccount}
        options={{
          headerShown: false,
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Screen
        name="MyOrders"
        component={MyOrders}
        options={{
          headerShown: false,
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Screen
        name="Payment"
        component={Payment}
        options={{
          headerShown: false,
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Screen
        name="Address"
        component={Address}
        options={{
          headerShown: false,
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Screen
        name="Subscription"
        component={Subscription}
        options={{
          headerShown: false,
          drawerItemStyle: {display: 'none'},
        }}
      />
      <Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
          drawerItemStyle: {display: 'none'},
        }}
      />
    </Navigator>
  );
};

export default DrawerTabs;
const styles = StyleSheet.create({
  header: {
    // padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    // justifyContent: 'space-between',
  },
  avatar: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
  },
  premiumBadge: {
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    width: '70%',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubText: {
    fontSize: 14,
  },
  mode: {flexDirection: 'row', justifyContent: 'flex-end', padding: 5},
  link: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
    marginVertical: 4,
  },
  linkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  activeLink: {
    backgroundColor: '#ccf4ceff', // Green background for active item
  },
  text: {
    fontWeight: '500',
  },
  activeText: {
    // color: 'white',
    fontWeight: 'bold',
  },
});
