import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import BottomTabs from './BottomTabs';
import Profile from '../modules/Profile/Profile';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {secureStorage} from '../utils/Storage/mmkv';

const {Navigator, Screen} = createDrawerNavigator();
const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const activeRoute = props.state.routes[props.state.index];

  const handleLogOut = () => {
    secureStorage.clearAll();
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
        drawerActiveTintColor: 'white',
        drawerActiveBackgroundColor: '#003CB3',
        drawerLabelStyle: {
          color: 'green',
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
