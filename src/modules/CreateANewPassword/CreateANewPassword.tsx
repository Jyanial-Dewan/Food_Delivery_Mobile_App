import React, {useEffect, useState} from 'react';
import {BackHandler, Image, StyleSheet, Text, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import ContainerNew from '../../common/components/Container';
import Column from '../../common/components/Column';
import CustomInputNew from '../../common/components/CustomInput';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import {api} from '../../common/apis/api';
import {BaseURL} from '../../../App';
import {httpRequest} from '../../common/constant/httpRequest';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native';
import CustomButtonNew from '../../common/components/CustomButton';
import Alert from '../../common/components/Alert';

const CreateANewPassword = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(true);
  const [isExit, setIsExit] = useState(false);
  const {control, handleSubmit, setValue, reset} = useForm<{
    new_password: string;
    retype_password: string;
  }>({
    defaultValues: {
      new_password: '',
      retype_password: '',
    },
  });

  const onSubmit = async (data: {
    new_password: string;
    retype_password: string;
  }) => {
    const api_params = {
      url: api.AuthAppsLogin,
      data: {
        new_password: data.new_password,
        retype_password: data.retype_password,
      },
      method: 'post',
      baseURL: BaseURL,
      // isConsole: true,
      // isConsoleParams: true,
    };
    const res = await httpRequest(api_params, setIsLoading);
    console.log(res, 'res');
    navigation.reset({
      index: 0,
      routes: [{name: 'LoginScreen'}],
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
        Create New Password
      </Text>
      <Column
        colStyle={{
          marginTop: 16,
          gap: 16,
        }}>
        <CustomInputNew
          setValue={setValue}
          control={control}
          name="new_password"
          label="New Password"
          rules={{
            required: 'New password is required',
            minLength: {
              value: 5,
              message: 'New password must be at least 5 characters long',
            },
          }}
          secureTextEntry={showPass}
          rightIcon={() => (
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Icon
                name={showPass ? 'eye-off' : 'eye'}
                color={'#323232'}
                size={22}
              />
            </TouchableOpacity>
          )}
        />
        <CustomInputNew
          setValue={setValue}
          control={control}
          name="retype_password"
          label="Retype Password"
          rules={{
            required: 'Retype password is required',
            minLength: {
              value: 5,
              message: 'Retype password must be at least 5 characters long',
            },
          }}
          secureTextEntry={showPass}
          rightIcon={() => (
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Icon
                name={showPass ? 'eye-off' : 'eye'}
                color={'#323232'}
                size={22}
              />
            </TouchableOpacity>
          )}
        />
      </Column>
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
export default CreateANewPassword;
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  btn: {
    borderRadius: 10,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  footer: {
    padding: 8,
    gap: 8,
  },
});
