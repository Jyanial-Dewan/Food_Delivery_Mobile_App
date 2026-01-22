import React, {useRef, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Container from '../../common/components/Container';
import {useForm} from 'react-hook-form';
import {COLORS} from '../../common/constant/Themes';
import Column from '../../common/components/Column';
import CustomTextNew from '../../common/components/CustomText';
import CustomInputNew from '../../common/components/CustomInput';
import Row from '../../common/components/Row';
import CustomButtonNew from '../../common/components/CustomButton';
import {Checkbox, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useToast} from '../../common/components/CustomToast';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackScreensParms} from '../../types/RootStactTypes';
import {ISignUpPayloadType} from '../../types/GeneralTypes';
import {httpRequest} from '../../common/constant/httpRequest';
import {api} from '../../common/apis/api';
import {BaseURL} from '../../../App';
import PhoneInput from 'react-native-phone-number-input';

type StackNavProps = StackNavigationProp<RootStackScreensParms, 'LoginScreen'>;

interface SignUpScreenProps {
  navigation: StackNavProps;
}

const SignUp = ({navigation}: SignUpScreenProps) => {
  const theme = useTheme();
  const [showPass, setShowPass] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(true);
  const toaster = useToast();
  // const isFocused = useIsFocused();
  // const [formattedValue, setFormattedValue] = useState('');
  const phoneInput = useRef<PhoneInput>(null);
  const {control, handleSubmit, setValue, reset, getValues} = useForm({
    defaultValues: {
      username: '',
      user_type: '',
      email: '',
      phone: '',
      first_name: '',
      last_name: '',
      password: '',
    },
  });
  // console.log(formattedValue, 'formattedValue');
  const onSubmit = async (data: ISignUpPayloadType) => {
    console.log(data, 'data');
    const loginPayload = {
      username: data?.username?.trim(),
      user_type: data?.user_type?.trim(),
      email: data?.email?.trim(),
      phone: [data?.phone],
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

    const res = await httpRequest(api_params, setIsLoading);
    console.log(res, 'res');

    // {"data": {"created_at": "2026-01-21T11:16:56.866Z", "email": "nepockma1@gmail.com", "first_name": "Nepo", "last_name": "Ckma", "phone": ["1517832317"], "user_id": 8, "user_type": "USER", "username": "nepockma11"}, "status": 201, "success": true}
    if (res?.status === 201 && res?.success) {
      toaster.show({message: 'User created successfully', type: 'success'});
      reset();
      navigation.replace('LoginScreen');
    } else {
      toaster.show({message: 'User created failed', type: 'warning'});
    }
  };

  return (
    <Container
      // isScrollView={false}
      style={styles.container}
      header={
        <View style={styles.header}>
          <Image
            source={require('../../assets/Logo/logo1.png')}
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
              Have an account?{' '}
              <Text style={[styles.underlineText, {color: COLORS.primary}]}>
                Sign in
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      }>
      <View>
        <Text style={styles.title}>Create a new account</Text>
      </View>
      <Column>
        <Column>
          <CustomTextNew
            text="Username"
            txtSize={16}
            txtWeight={'500'}
            padBottom={10}
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
        <Column style={{marginTop: 10}}>
          <CustomTextNew
            text="User Type"
            txtSize={16}
            txtWeight={'500'}
            padBottom={10}
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
        <Column style={{marginTop: 10}}>
          <CustomTextNew
            text="Email"
            txtSize={16}
            txtWeight={'500'}
            padBottom={10}
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
        <Column style={{marginTop: 10}}>
          <CustomTextNew
            text="Phone Number"
            txtSize={16}
            txtWeight={'500'}
            padBottom={10}
          />
          <PhoneInput
            ref={phoneInput}
            defaultValue={getValues('phone')}
            defaultCode="BD"
            layout="first"
            onChangeFormattedText={text => {
              setValue('phone', text);
              // setFormattedValue(text);
            }}
            containerStyle={{
              borderWidth: 1,
              borderColor: COLORS.offDay,
              height: 50,
              width: '100%',
              paddingHorizontal: 3,
              borderRadius: 8,
              backgroundColor: '#f9f9f9',
            }}
            textInputStyle={{
              fontSize: 16,
              height: 50,
              fontWeight: '500',
            }}
            codeTextStyle={{
              color: '#757775ff',
            }}
            // withDarkTheme
            // withShadow
            // autoFocus
          />
        </Column>
        <Column style={{marginTop: 10}}>
          <CustomTextNew
            text="First Name"
            txtSize={16}
            txtWeight={'500'}
            padBottom={10}
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
        <Column style={{marginTop: 10}}>
          <CustomTextNew
            text="Last Name"
            txtSize={16}
            txtWeight={'500'}
            padBottom={10}
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
            marginTop: 10,
          }}>
          <CustomTextNew
            text="Password"
            txtSize={16}
            txtWeight={'500'}
            padBottom={10}
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
  },
  logoImage: {
    width: 80,
    // height: 80,
    resizeMode: 'contain',
  },
  btn: {
    borderRadius: 10,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    marginBottom: 16,
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 35,
  },
  footer: {
    padding: 8,
    gap: 8,
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
