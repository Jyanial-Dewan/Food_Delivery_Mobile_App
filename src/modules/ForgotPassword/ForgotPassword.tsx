import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import ContainerNew from '../../common/components/Container';
import {useTheme} from 'react-native-paper';
import CustomButtonNew from '../../common/components/CustomButton';
import {useState} from 'react';
import {IForgotPasswordPayloadType} from '../../types/GeneralTypes';
import {useForm} from 'react-hook-form';
import Column from '../../common/components/Column';
import CustomTextNew from '../../common/components/CustomText';
import CustomInputNew from '../../common/components/CustomInput';
import {api} from '../../common/apis/api';
import {BaseURL} from '../../../App';
import {httpRequest} from '../../common/constant/httpRequest';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const ForgotPassword = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  const {control, handleSubmit, setValue, reset} =
    useForm<IForgotPasswordPayloadType>({
      defaultValues: {
        email: '',
      },
    });

  const onSubmit = async (data: IForgotPasswordPayloadType) => {
    const api_params = {
      url: api.AuthAppsLogin,
      data: {email: data.email},
      method: 'post',
      baseURL: BaseURL,
      // isConsole: true,
      // isConsoleParams: true,
    };
    const res = await httpRequest(api_params, setIsLoading);
    console.log(res, 'res');
    navigation.reset({
      index: 0,
      routes: [{name: 'OTPVerify'}],
    });
    // if (res?.data?.access_token && res?.data?.isLoggedIn) {
    //   dispatch(setToken(res?.data));
    //   secureStorage.setItem('user_token', JSON.stringify(res?.data));
    //   navigation.replace('DrawerTabs');
    // } else {
    //   toaster.show({message: res?.data?.message, type: 'warning'});
    // }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <ContainerNew
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      header={
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
            <Icon name="arrow-left" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <Image
            source={require('../../assets/Logo/logo1.png')}
            style={styles.logoImage}
          />
          <View></View>
        </View>
      }
      footer={
        <View style={styles.footer}>
          <CustomButtonNew
            disabled={isLoading}
            btnText="Continue"
            isLoading={isLoading}
            onBtnPress={handleSubmit(onSubmit)}
            btnstyle={[styles.btn, {backgroundColor: theme.colors.primary}]}
            btnTextStyle={styles.btnTxt}
          />
        </View>
      }>
      <Column>
        <Column>
          <CustomTextNew
            text="Forgot your password"
            txtStyle={[
              styles.title,
              {
                color: theme.colors.surface,
              },
            ]}
          />
          <CustomTextNew
            text="Enter the verification code sent to your email sample@example.com"
            txtStyle={[
              styles.subTitle,
              {
                color: theme.colors.surface,
              },
            ]}
          />
          <CustomInputNew
            setValue={setValue}
            control={control}
            name="email"
            label="Enter your email"
            rules={{
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
              },
              required: 'Email is required',
              minLength: {
                value: 3,
                message: 'Email must be at least 3 characters long',
              },
            }}
          />
        </Column>
      </Column>
    </ContainerNew>
  );
};
export default ForgotPassword;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '700',
    paddingVertical: 16,
  },
  subTitle: {
    fontSize: 16,
    paddingVertical: 16,
  },
  footer: {
    padding: 8,
    gap: 8,
  },
});
