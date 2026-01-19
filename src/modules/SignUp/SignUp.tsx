import React, {useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Container from '../../common/components/Container';
import {useForm} from 'react-hook-form';
import {COLORS} from '../../common/constant/Themes';
import Column from '../../common/components/Column';
import CustomTextNew from '../../common/components/CustomText';
import CustomInputNew from '../../common/components/CustomInput';
import Row from '../../common/components/Row';
import CustomButtonNew from '../../common/components/CustomButton';
import {Checkbox} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useToast} from '../../common/components/CustomToast';
import {useIsFocused} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackScreensParms} from '../../types/RootStactTypes';
import {ISignUpPayloadType} from '../../types/GeneralTypes';
import {httpRequest} from '../../common/constant/httpRequest';
import {api} from '../../common/apis/api';
import {BaseURL} from '../../../App';
import {secureStorage} from '../../utils/Storage/mmkv';
import {useDispatch} from 'react-redux';
import {setToken} from '../../stores/Redux/Slices/UserSlice';

type StackNavProps = StackNavigationProp<RootStackScreensParms, 'LoginScreen'>;

interface SignUpScreenProps {
  navigation: StackNavProps;
}

const SignUp = ({navigation}: SignUpScreenProps) => {
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(true);
  const toaster = useToast();
  const isFocused = useIsFocused();
  const {control, handleSubmit, setValue, reset, getValues} = useForm({
    defaultValues: {
      username: '',
      user_type: '',
      email: '',
      phone: [],
      first_name: '',
      last_name: '',
      password: '',
    },
  });

  const onSubmit = async (data: ISignUpPayloadType) => {
    const loginPayload = {
      username: data?.username?.trim(),
      user_type: data?.user_type?.trim(),
      email: data?.email?.trim(),
      phone: data?.phone,
      first_name: data?.first_name?.trim(),
      last_name: data?.last_name?.trim(),
      password: data?.password?.trim(),
    };

    const api_params = {
      url: api.UsersCreate,
      data: loginPayload,
      method: 'post',
      baseURL: BaseURL,
      // isConsole: true,
      // isConsoleParams: true,
    };

    const res = await httpRequest({}, setIsLoading);
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
      // isScrollView={false}
      style={styles.container}
      header={
        <View style={styles.header}>
          <Image
            source={require('../../assets/Logo/logo.png')}
            style={styles.logoImage}
          />
        </View>
      }
      footer={
        <View style={styles.footer}>
          <CustomButtonNew
            disabled={isLoading}
            btnText="Create account"
            isLoading={isLoading}
            onBtnPress={handleSubmit(onSubmit)}
            btnstyle={styles.btn}
            btnTextStyle={styles.btnTxt}
          />
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.signUpText}>
              Have an account? <Text style={styles.underlineText}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      }>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View>
        <Text style={styles.title}>Create a new account</Text>
      </View>
      <Column>
        <Column>
          <CustomTextNew
            text="Username"
            txtSize={16}
            txtWeight={'500'}
            padBottom={14}
          />
          <CustomInputNew
            setValue={setValue}
            control={control}
            name="username"
            label="Enter your username"
            rules={{
              required: 'Username is required',
            }}
          />
        </Column>
        <Column>
          <CustomTextNew
            text="User Type"
            txtSize={16}
            txtWeight={'500'}
            padBottom={14}
          />
          <CustomInputNew
            setValue={setValue}
            control={control}
            name="user_type"
            label="Enter your user type"
            rules={{
              required: 'User type is required',
            }}
          />
        </Column>
        <Column>
          <CustomTextNew
            text="Email"
            txtSize={16}
            txtWeight={'500'}
            padBottom={14}
          />
          <CustomInputNew
            setValue={setValue}
            control={control}
            name="email"
            label="Enter your email"
            rules={{
              required: 'Email is required',
            }}
          />
        </Column>
        <Column>
          <CustomTextNew
            text="Phone Number"
            txtSize={16}
            txtWeight={'500'}
            padBottom={14}
          />
          <CustomInputNew
            setValue={setValue}
            control={control}
            name="phone"
            label="Enter your phone number"
            rules={{
              required: 'Phone number is required',
            }}
          />
        </Column>
        <Column>
          <CustomTextNew
            text="First Name"
            txtSize={16}
            txtWeight={'500'}
            padBottom={14}
          />
          <CustomInputNew
            setValue={setValue}
            control={control}
            name="first_name"
            label="Enter your first name"
            rules={{
              required: 'First name is required',
            }}
          />
        </Column>
        <Column>
          <CustomTextNew
            text="Last Name"
            txtSize={16}
            txtWeight={'500'}
            padBottom={14}
          />
          <CustomInputNew
            setValue={setValue}
            control={control}
            name="last_name"
            label="Enter your last name"
            rules={{
              required: 'Last name is required',
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
              label="I agree to terms & conditions"
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked(!checked);
              }}
              position="leading"
            />
          </Row>
        </Column>
      </Column>
    </Container>
  );
};

export default SignUp;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.headerText,
  },
  logoImage: {
    width: 80,
    // height: 80,
    resizeMode: 'contain',
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
    marginBottom: 16,
    fontSize: 35,
    fontWeight: '900',
    color: '#1E1E1E',
    textAlign: 'center',
    lineHeight: 35,
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
