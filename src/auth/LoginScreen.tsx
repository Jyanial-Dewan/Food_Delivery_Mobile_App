import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Container from '../common/components/Container';
import {useForm} from 'react-hook-form';
import {COLORS} from '../common/constant/Themes';
import Column from '../common/components/Column';
import CustomTextNew from '../common/components/CustomText';
import CustomInputNew from '../common/components/CustomInput';
import Row from '../common/components/Row';
import CustomButtonNew from '../common/components/CustomButton';
import {Checkbox} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useToast} from '../common/components/CustomToast';
import {useIsFocused} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackScreensParms} from '../types/RootStactTypes';
import {ILogInPayloadType} from '../types/GeneralTypes';
import {httpRequest} from '../common/constant/httpRequest';
import {api} from '../common/apis/api';
import {BaseURL} from '../../App';
import {secureStorage} from '../utils/Storage/mmkv';
import {useDispatch} from 'react-redux';
import {setToken} from '../stores/Redux/Slices/UserSlice';

type StackNavProps = StackNavigationProp<RootStackScreensParms, 'LoginScreen'>;

interface LoginScreenProps {
  navigation: StackNavProps;
}

const LoginScreen = ({navigation}: LoginScreenProps) => {
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
    const user = secureStorage.getItem('user');
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
      secureStorage.setItem('user', data.user);
      secureStorage.setItem('password', data.password);
    } else {
      secureStorage.removeItem('user');
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
      dispatch(setToken(res?.data));
      secureStorage.setItem('user_token', JSON.stringify(res?.data));
      // navigation.replace('DrawerTabs');
    } else {
      toaster.show({message: res?.data?.message, type: 'warning'});
    }
  };
  // const userToken = useSelector((state: RootState) => state.userToken);
  // const u = secureStorage.getItem('user_token');
  // console.log(u, 'user_token 22');

  return (
    <Container
      isScrollView={false}
      style={styles.container}
      footer={
        <View style={styles.footer}>
          <CustomButtonNew
            disabled={isLoading}
            btnText="Login"
            isLoading={isLoading}
            onBtnPress={handleSubmit(onSubmit)}
            btnstyle={styles.btn}
            btnTextStyle={styles.btnTxt}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signUpText}>
              Don't have an account?{' '}
              <Text style={styles.underlineText}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      }>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View>
        <Text style={styles.title}>Log into your account</Text>
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
              labelStyle={{color: COLORS.headerText, paddingLeft: 0}}
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
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </Column>
          </Row>
        </Column>
      </Column>
    </Container>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  btn: {
    borderRadius: 10,
    backgroundColor: COLORS.green,
  },
  btnTxt: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: COLORS.green,
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
  signUpText: {
    // color: COLORS.green,
    // fontSize: 16,
    // fontWeight: 'bold',
    textAlign: 'center',
  },
  underlineText: {
    textDecorationLine: 'underline',
    color: COLORS.green,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
