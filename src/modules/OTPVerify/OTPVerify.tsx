import React, {useEffect} from 'react';
import {BackHandler, Image, StyleSheet, Text, View} from 'react-native';
import ContainerNew from '../../common/components/Container';
import {useTheme} from 'react-native-paper';
import {OtpInput} from 'react-native-otp-entry';
import CustomButtonNew from '../../common/components/CustomButton';
import {useState} from 'react';
import {api} from '../../common/apis/api';
import {BaseURL} from '../../../App';
import {useForm} from 'react-hook-form';
import {httpRequest} from '../../common/constant/httpRequest';
import {useNavigation} from '@react-navigation/native';
import Alert from '../../common/components/Alert';
const OTPVerify = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  const {control, handleSubmit, setValue, reset} = useForm<{OTPcode: string}>({
    defaultValues: {
      OTPcode: '',
    },
  });
  const onSubmit = async (data: {OTPcode: string}) => {
    const api_params = {
      url: api.AuthAppsLogin,
      data: {OTPcode: data.OTPcode},
      method: 'post',
      baseURL: BaseURL,
      // isConsole: true,
      // isConsoleParams: true,
    };
    const res = await httpRequest(api_params, setIsLoading);
    console.log(res, 'res');
    navigation.reset({
      index: 0,
      routes: [{name: 'CreateANewPassword'}],
    });
    // if (res?.data?.access_token && res?.data?.isLoggedIn) {
    //   dispatch(setToken(res?.data));
    //   secureStorage.setItem('user_token', JSON.stringify(res?.data));
    //   navigation.replace('DrawerTabs');
    // } else {
    //   toaster.show({message: res?.data?.message, type: 'warning'});
    // }
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

  return (
    <ContainerNew
      style={[styles.container, {backgroundColor: theme.colors.background}]}
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
            btnText="Continue"
            isLoading={isLoading}
            onBtnPress={handleSubmit(onSubmit)}
            btnstyle={[styles.btn, {backgroundColor: theme.colors.primary}]}
            btnTextStyle={styles.btnTxt}
          />
        </View>
      }>
      <Text style={[styles.title, {color: theme.colors.onSurface}]}>
        OTP Verify
      </Text>
      <OtpInput
        numberOfDigits={6}
        focusColor="green"
        autoFocus={false}
        hideStick={true}
        placeholder="******"
        blurOnFilled={true}
        disabled={false}
        type="numeric"
        secureTextEntry={false}
        focusStickBlinkingDuration={500}
        onFocus={() => console.log('Focused')}
        onBlur={() => console.log('Blurred')}
        onTextChange={text => console.log(text)}
        onFilled={text => console.log(`OTP is ${text}`)}
        textInputProps={{
          accessibilityLabel: 'One-Time Password',
        }}
        textProps={{
          accessibilityRole: 'text',
          accessibilityLabel: 'OTP digit',
          allowFontScaling: false,
        }}
        theme={{
          containerStyle: styles.container,
          pinCodeContainerStyle: styles.pinCodeContainer,
          // pinCodeTextStyle: styles.pinCodeText,
          // focusStickStyle: styles.focusStick,
          // focusedPinCodeContainerStyle: styles.activePinCodeContainer,
          // placeholderTextStyle: styles.placeholderText,
          // filledPinCodeContainerStyle: styles.filledPinCodeContainer,
          // disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
        }}
      />
      <Alert
        visible={visible}
        onDismiss={() => setVisible(false)}
        title={'Exit App'}
        content={'Are you sure you want to exit?'}
        cancel={() => setVisible(false)}
        ok={() => BackHandler.exitApp()}
      />
    </ContainerNew>
  );
};
export default OTPVerify;
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
  pinCodeContainer: {},
  footer: {
    padding: 8,
    gap: 8,
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
});
