import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
import Profile from '../modules/Profile/Profile';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {secureStorage} from '../utils/Storage/mmkv';
import {useDispatch} from 'react-redux';
import {clearToken} from '../stores/Redux/Slices/UserSlice';
import {useTheme} from 'react-native-paper';
import {setTheme} from '../stores/Redux/Slices/ThemeSlice';

const {Navigator, Screen} = createDrawerNavigator();
const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const theme = useTheme();
  const activeRoute = props.state.routes[props.state.index];
  const dispatch = useDispatch();

  const handleLogOut = () => {
    secureStorage.removeItem('user_token');
    dispatch(clearToken());
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
      name: 'Home',
      icon: 'home',
      screen: 'BottomTabs',
    },
    {
      name: 'Profile',
      icon: 'person',
      screen: 'Profile',
    },
    // {
    //   name: 'Settings',
    //   icon: 'settings',
    //   screen: 'Settings',
    // },
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
      <TouchableOpacity onPress={handleThemeChange} style={styles.mode}>
        <Icon
          name={theme.dark ? 'dark-mode' : 'light-mode'}
          size={22}
          color={theme.dark ? 'white' : 'green'}
        />
      </TouchableOpacity>
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
            isActive(link.screen) && {backgroundColor: theme.colors.primary},
          ]}>
          <Text
            style={[
              styles.text,
              isActive(link.screen) && styles.activeText,
              {color: theme.colors.surface},
            ]}>
            {link.name}
          </Text>
        </TouchableOpacity>
      ))}
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
        name="Profile"
        component={Profile}
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
  mode: {padding: 5},
  link: {
    // backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 6,
    // marginVertical: 4,
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
