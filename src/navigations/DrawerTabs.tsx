import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
import Profile from '../modules/Profile/Profile';
import {StyleSheet, Text, TouchableOpacity, useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {secureStorage} from '../utils/Storage/mmkv';
import {useDispatch} from 'react-redux';
import {clearToken} from '../stores/Redux/Slices/UserSlice';

const {Navigator, Screen} = createDrawerNavigator();
const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const activeRoute = props.state.routes[props.state.index];
  const dispatch = useDispatch();

  const handleLogOut = () => {
    secureStorage.removeItem('user_token');
    dispatch(clearToken());
  };

  const isActive = (routeName: string) => {
    return activeRoute.name === routeName;
  };

  return (
    <DrawerContentScrollView {...props}>
      <TouchableOpacity onPress={() => {}} style={styles.mode}>
        <Icon
          name={isDarkMode ? 'dark-mode' : 'light-mode'}
          size={22}
          color={isDarkMode ? 'white' : 'green'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => props.navigation.navigate('BottomTabs')}
        style={[styles.link, isActive('BottomTabs') && styles.activeLink]}>
        <Text
          style={[styles.text, isActive('BottomTabs') && styles.activeText]}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Profile')}
        style={[styles.link, isActive('Profile') && styles.activeLink]}>
        <Text style={[styles.text, isActive('Profile') && styles.activeText]}>
          Profile
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogOut} style={styles.link}>
        <Text style={styles.text}>LogOut</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};
const DrawerTabs = () => {
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
          //   backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
          padding: 10,
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
    color: '#333',
  },
  activeText: {
    // color: 'white',
    fontWeight: 'bold',
  },
});
