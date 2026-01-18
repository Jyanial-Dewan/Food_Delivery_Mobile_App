import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../auth/LoginScreen';
import DrawerTabs from './DrawerTabs';
import {useSelector} from 'react-redux';
import {RootState} from '../stores/Redux/Store/Store';
import {useEffect} from 'react';

import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackScreensParms} from '../types/RootStactTypes';

type RootStackNavigationProp = NativeStackNavigationProp<RootStackScreensParms>;

const {Navigator, Screen} = createStackNavigator<RootStackScreensParms>();
const RootStack = () => {
  const userToken = useSelector((state: RootState) => state.userToken);
  const navigation = useNavigation<RootStackNavigationProp>();

  useEffect(() => {
    if (
      userToken?.access_token &&
      userToken?.isLoggedIn &&
      userToken?.user_id
    ) {
      // Reset the navigation stack and navigate to DrawerTabs
      navigation.reset({
        index: 0,
        routes: [{name: 'DrawerTabs'}],
      });
    }
  }, [userToken, navigation]);

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {!userToken?.isLoggedIn ? (
        <Screen name="LoginScreen" component={LoginScreen} />
      ) : (
        <Screen name="DrawerTabs" component={DrawerTabs} />
      )}
    </Navigator>
  );
};

export default RootStack;
