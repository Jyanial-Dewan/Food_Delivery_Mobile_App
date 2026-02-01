import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Container from '../common/components/Container';
import {useForm} from 'react-hook-form';
import {COLORS} from '../common/constant/Themes';
import Column from '../common/components/Column';
import CustomTextNew from '../common/components/CustomText';
import CustomInputNew from '../common/components/CustomInput';
import Row from '../common/components/Row';
import CustomButtonNew from '../common/components/CustomButton';
import {Checkbox, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useToast} from '../common/components/CustomToast';
import {useIsFocused} from '@react-navigation/native';
import {RootStackScreensParms} from '../types/RootStactTypes';
import {ILogInPayloadType} from '../types/GeneralTypes';
import {httpRequest} from '../common/constant/httpRequest';
import {api} from '../common/apis/api';
import {BaseURL} from '../../App';
import {secureStorage} from '../utils/Storage/mmkv';
import {useDispatch} from 'react-redux';
import {setToken, setUser} from '../stores/Redux/Slices/UserSlice';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import Alert from '../common/components/Alert';
import {BackHandler} from 'react-native';
import Alert from '../common/components/Alert';

type StackNavProps = NativeStackNavigationProp<
  RootStackScreensParms,
  'LoginScreen'
>;

interface LoginScreenProps {
  navigation: StackNavProps;
}

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(true);
  const toaster = useToast();
  const isFocused = useIsFocused();
  const {control, handleSubmit, setValue, reset, getValues} = useForm({
    defaultValues: {
      user: '',
      password: '',
    },
  });

  useEffect(() => {
    const user = secureStorage.getItem('emailOrUser');
    const password = secureStorage.getItem('password');

    if (user && password) {
      setValue('user', user);
      setValue('password', password);
      setChecked(true);
    }
  }, [setValue]);

  const onSubmit = async (data: ILogInPayloadType) => {
    // store remember me data
    if (checked) {
      secureStorage.setItem('emailOrUser', data.user);
      secureStorage.setItem('password', data.password);
    } else {
      secureStorage.removeItem('emailOrUser');
      secureStorage.removeItem('password');
    }

    const loginPayload = {
      user: data?.user?.trim(),
      password: data?.password?.trim(),
    };

    const api_params = {
      url: api.AuthAppsLogin,
      data: loginPayload,
      method: 'post',
      baseURL: BaseURL,
      // isConsole: true,
      // isConsoleParams: true,
    };

    const res = await httpRequest(api_params, setIsLoading);
    console.log(res, 'res');
    if (res?.data?.access_token && res?.data?.isLoggedIn) {
      const user_api_params = {
        url: `${api.User}?user_id=${res.data.user_id}`,
        method: 'get',
        baseURL: BaseURL,
        // isConsole: true,
        // isConsoleParams: true,
      };
      const user_res = await httpRequest(user_api_params, setIsLoading);
      console.log(user_res, 'user res');
      dispatch(setToken(res?.data));
      dispatch(setUser(user_res?.data.result));
      secureStorage.setItem('user_token', JSON.stringify(res?.data));
      secureStorage.setItem('user', JSON.stringify(user_res?.data.result));
      navigation.replace('DrawerTabs');
    } else {
      toaster.show({message: res?.data?.message, type: 'warning'});
    }
  };
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const backAction = () => {
      setVisible(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert(
  //       'Exit App',
  //       'Are you sure you want to exit?',
  //       [
  //         {
  //           text: 'Cancel',
  //           onPress: () => null,
  //           style: 'cancel',
  //         },
  //         {
  //           text: 'Exit',
  //           onPress: () => BackHandler.exitApp(),
  //         },
  //       ],
  //       {cancelable: false},
  //     );
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove();
  // }, []);

  return (
    <Container
      // isScrollView={false}
      style={styles.container}
      header={
        <View style={styles.header}>
          <Image
            source={require('../assets/Logo/logo1.png')}
            style={styles.logoImage}
          />
        </View>
      }
      footer={
        <View style={styles.footer}>
          <CustomButtonNew
            disabled={isLoading}
            btnText="Sign in"
            isLoading={isLoading}
            onBtnPress={handleSubmit(onSubmit)}
            btnstyle={[styles.btn, {backgroundColor: theme.colors.primary}]}
            btnTextStyle={styles.btnTxt}
          />
          <View style={styles.signUpContainer}>
            <Text style={[styles.signUpText, {color: theme.colors.surface}]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUpScreen')}>
              <Text
                style={[styles.underlineText, {color: theme.colors.primary}]}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      }>
      <View>
        <Text style={[styles.title, {color: theme.colors.surface}]}>
          Log into your account
        </Text>
      </View>
      <Column>
        <Column>
          <CustomTextNew
            text="Email or Username"
            txtSize={16}
            txtWeight={'500'}
            padBottom={14}
          />
          <CustomInputNew
            setValue={setValue}
            control={control}
            name="user"
            label="Enter your email or username"
            rules={{
              required: 'User name is required',
              minLength: {
                value: 3,
                message: 'User name must be at least 3 characters long',
              },
            }}
          />
        </Column>

        <Column
          colStyle={{
            marginTop: 16,
          }}>
          <CustomTextNew
            text="Password"
            txtSize={16}
            txtWeight={'500'}
            padBottom={14}
          />
          <CustomInputNew
            setValue={setValue}
            control={control}
            name="password"
            label="Enter your password"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 5,
                message: 'Password must be at least 5 characters long',
              },
            }}
            secureTextEntry={showPass}
            rightIcon={() => (
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Icon
                  name={showPass ? 'eye-off' : 'eye'}
                  color={COLORS.iconColor}
                  size={22}
                />
              </TouchableOpacity>
            )}
          />
          <Row
            rowStyle={{marginTop: 16}}
            justify="space-between"
            align="center">
            <Checkbox.Item
              style={{marginVertical: 0, paddingHorizontal: 0}}
              labelStyle={{color: theme.colors.surface, paddingLeft: 0}}
              label="Remember"
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked(!checked);
              }}
              position="leading"
            />
            <Column>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}>
                <Text
                  style={[
                    styles.forgotPassword,
                    {color: theme.colors.primary},
                  ]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </Column>
          </Row>
        </Column>
      </Column>
      <Alert
        visible={visible}
        onDismiss={() => setVisible(false)}
        title={'Exit App'}
        content={'Are you sure you want to exit?'}
        cancel={() => setVisible(false)}
        ok={() => BackHandler.exitApp()}
      />
    </Container>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  logoImage: {
    resizeMode: 'center',
    height: 20,
  },
  btn: {
    borderRadius: 10,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  forgotPassword: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  footer: {
    padding: 8,
    gap: 8,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    textAlign: 'center',
  },
  underlineText: {
    textDecorationLine: 'underline',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
