import React from 'react';
import LoginScreen from '../auth/LoginScreen';
import DrawerTabs from './DrawerTabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackScreensParms} from '../types/RootStactTypes';
import Onboarding from '../modules/Onboarding/Onboarding';
import SignUp from '../modules/SignUp/SignUp';
import Loader from '../auth/Loader';
import {useTheme} from 'react-native-paper';
import ForgotPassword from '../modules/ForgotPassword/ForgotPassword';
import OTPVerify from '../modules/OTPVerify/OTPVerify';
import CreateANewPassword from '../modules/CreateANewPassword/CreateANewPassword';
const {Navigator, Screen} = createNativeStackNavigator<RootStackScreensParms>();
const RootStack = () => {
  const theme = useTheme();

  return (
    <Navigator
      initialRouteName="Loader"
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}>
      <Screen name="Loader" component={Loader} initialParams={{delay: 15}} />
      <Screen name="Onboarding" component={Onboarding} />
      <Screen name="DrawerTabs" component={DrawerTabs} />
      <Screen name="LoginScreen" component={LoginScreen} />
      <Screen name="SignUpScreen" component={SignUp} />
      <Screen name="ForgotPassword" component={ForgotPassword} />
      <Screen name="OTPVerify" component={OTPVerify} />
      <Screen name="CreateANewPassword" component={CreateANewPassword} />
    </Navigator>
  );
};

export default RootStack;
