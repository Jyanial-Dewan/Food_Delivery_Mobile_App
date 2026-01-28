import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ContainerNew from '../../common/components/Container';
import Header1 from '../../common/components/Header1';
import {Avatar, useTheme} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomTextNew from '../../common/components/CustomText';
import PhoneInput from 'react-native-phone-number-input';
import {COLORS} from '../../common/constant/Themes';
import {useForm} from 'react-hook-form';
import Column from '../../common/components/Column';
import CustomInputNew from '../../common/components/CustomInput';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

const links = [
  {
    name: 'Address',
    screen: 'Address',
  },
  {
    name: 'Payment',
    screen: 'Payment',
  },
  {
    name: 'My Orders',
    screen: 'MyOrders',
  },
  {
    name: 'Settings',
    screen: 'Settings',
  },
];

const MyAccount = () => {
  const theme = useTheme();
  const [editAccount, setEditAccount] = useState(false);
  const phoneInput = useRef<PhoneInput>(null);
  const [isProfileChange, setIsProfileChange] = useState(false);
  const {control, handleSubmit, setValue, reset, getValues} = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      address: '',
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const handleEditSave = () => {
    setEditAccount(!editAccount);
    if (editAccount) {
      handleSubmit(onSubmit)();
    } else {
    }
  };

  // hooks
  const sheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // callbacks
  const handleSheetChange = useCallback((index: number) => {
    console.log('handleSheetChange', index);
  }, []);
  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  // Back button
  const handleIsEditAccount = () => {
    handleClosePress();
    setEditAccount(false);
  };

  useEffect(() => {
    const backAction = () => {
      handleIsEditAccount();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleEditProfile = () => {
    handleSnapPress(0);
  };

  return (
    <GestureHandlerRootView style={styles.BottomSheetContainer}>
      <ContainerNew
        style={[styles.container, {backgroundColor: theme.colors.background}]}
        header={
          <Header1
            title="My Account"
            leftFuncPress={() => handleIsEditAccount()}
            rightFuncTitle={editAccount ? 'Save' : 'Edit'}
            rightFuncPress={() => handleEditSave()}
          />
        }>
        {!editAccount ? (
          <>
            {/* View Account */}
            <View style={{gap: 20, padding: 10}}>
              <View style={styles.header}>
                <Avatar.Image
                  style={[
                    styles.avatar,
                    {backgroundColor: theme.colors.secondary},
                  ]}
                  size={90}
                  source={require('../../assets/Profile/profile.png')}
                />
                <View style={styles.headerContent}>
                  <Text
                    style={[styles.headerText, {color: theme.colors.surface}]}>
                    Danial Jones
                  </Text>
                  <Text
                    style={[
                      styles.headerSubText,
                      {color: theme.colors.surface},
                    ]}>
                    danial.jones@gmail.com
                  </Text>
                  <Text
                    style={[
                      styles.headerSubText,
                      {color: theme.colors.surface},
                    ]}>
                    +8801234567890
                  </Text>
                </View>
              </View>
              <View style={{}}>
                {links.map((link, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {}}
                    style={[
                      styles.link,
                      {backgroundColor: theme.colors.secondary},
                    ]}>
                    <View style={styles.linkContent}>
                      <Text
                        style={[styles.text, {color: theme.colors.surface}]}>
                        {link.name}
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={22}
                      color={theme.colors.surface}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Edit Account */}
            <View style={styles.editAccount}>
              <View>
                <Avatar.Image
                  style={[
                    styles.avatar,
                    {backgroundColor: theme.colors.secondary},
                  ]}
                  size={90}
                  source={require('../../assets/Profile/profile.png')}
                />
                <View
                  style={[
                    styles.cameraContainer,
                    {backgroundColor: theme.colors.surface},
                  ]}>
                  <TouchableOpacity onPress={() => handleEditProfile()}>
                    <MaterialCommunityIcons
                      name="camera"
                      size={16}
                      color={theme.colors.onBackground}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{gap: 10}}>
                <Column>
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
                  />
                </Column>
                <Column>
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
                  />
                </Column>
                <Column>
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
                    containerStyle={styles.phoneContainer}
                    textInputStyle={styles.phoneTextInput}
                    codeTextStyle={{
                      color: '#757775ff',
                    }}
                    // withDarkTheme
                    // withShadow
                    // autoFocus
                  />
                </Column>

                <Column>
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
                  />
                </Column>
                <Column>
                  <CustomTextNew
                    text="Address"
                    txtSize={16}
                    txtWeight={'500'}
                    padBottom={10}
                  />
                  <CustomInputNew
                    setValue={setValue}
                    control={control}
                    name="address"
                    label="Enter your address"
                  />
                </Column>
              </View>
            </View>
          </>
        )}
      </ContainerNew>
      {/* <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
      <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
      <Button title="Snap To 25%" onPress={() => handleSnapPress(0)} />
      <Button title="Close" onPress={() => handleClosePress()} /> */}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        onChange={handleSheetChange}
        handleStyle={{
          backgroundColor: theme.colors.primary,
          borderTopEndRadius: 15,
          borderTopStartRadius: 15,
        }}>
        <BottomSheetView
          style={[
            styles.contentContainer,
            {backgroundColor: theme.colors.secondary},
          ]}>
          <Text>Awesome 🔥</Text>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};
export default MyAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    // width: 80,
    // height: 80,
  },
  cameraContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 5,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: 'white',
    // height: 20,
    // width: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerSubText: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  headerContent: {gap: 3, justifyContent: 'center', alignItems: 'center'},
  link: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
    marginVertical: 4,
  },
  linkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  editAccount: {
    gap: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneContainer: {
    borderWidth: 1,
    borderColor: COLORS.offDay,
    // height: 50,
    width: '100%',
    paddingHorizontal: 3,
    paddingVertical: 0,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  phoneTextInput: {
    // fontSize: 16,
    // height: 50,
    fontWeight: '500',
    color: '#757775',
    padding: 0,
  },
  BottomSheetContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});
