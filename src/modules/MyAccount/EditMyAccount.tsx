import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
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
import CustomButtonNew from '../../common/components/CustomButton';
import {httpMethod, httpRequest} from '../../common/constant/httpRequest';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useSelector} from 'react-redux';
import {BaseURL} from '../../../App';
import {api} from '../../common/apis/api';
import {useToast} from '../../common/components/CustomToast';
import {updateUser} from '../../stores/Redux/Slices/UserSlice';
import {useDispatch} from 'react-redux';

const EditMyAccount = ({navigation}: any) => {
  const theme = useTheme();
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const [editAccount, setEditAccount] = useState(false);
  const phoneInput = useRef<PhoneInput>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState({
    uri: user?.profile_image_thumbnail,
    name: '',
    type: '',
  });
  const [isProfileChange, setIsProfileChange] = useState(false);
  const toaster = useToast();
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
  const handleBackPress = () => {
    handleClosePress();
    setEditAccount(false);
    setIsProfileChange(false);
    setProfilePhoto({
      uri: user?.profile_image_thumbnail,
      name: '',
      type: '',
    });
    reset();
  };

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleOpenBottomSheet = () => {
    handleSnapPress(1);
  };

  // Take photo using camera
  const onTakePhoto = async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        compressImageQuality: 0.6,
      });
      setProfilePhoto({
        uri: image.path,
        name: image.filename || '',
        type: image.mime || '',
      });
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  /* Choose Image from gallery */
  const onPickImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        compressImageQuality: 0.6,
      });
      console.log(image, 'image......');
      setIsProfileChange(true);
      setProfilePhoto({
        uri: image.path,
        name: image.filename || '',
        type: image.mime,
      });
      handleClosePress();
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  const handleEditSave = () => {
    handleSubmit(onSubmit)();
    setEditAccount(!editAccount);
    if (editAccount) {
    } else {
    }
  };

  const {control, handleSubmit, setValue, reset, getValues, formState} =
    useForm({
      defaultValues: {
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone: user?.phone?.[0] || '',
        email: user?.email || '',
        address: user?.address || '',
      },
    });
  const {dirtyFields} = formState;
  const isFormDirty = Object.keys(dirtyFields).length > 0;
  console.log(isFormDirty);
  const onSubmit = async (data: any) => {
    console.log(data);
    if (!user?.user_id) return;

    const api_params = {
      url: `${api.UserUpdate}?user_id=${user.user_id}`,
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        email: data.email,
        address: data.address,
      },
      method: 'PUT' as httpMethod,
      baseURL: BaseURL,
      isEncrypted: false,
      isConsole: true,
      isConsoleParams: true,
    };
    const profile_params = {
      url: `${api.ProfileImage}/${user.user_id}`,
      method: 'POST' as httpMethod,
      // isParamsAndmediaFile: true,
      mediaFile: profilePhoto,
      fileKey: 'profile_image',
      baseURL: BaseURL,
      isEncrypted: false,
      isConsole: true,
      isConsoleParams: true,
    };

    if (isProfileChange) {
      const profileResponse = await httpRequest(
        profile_params,
        setIsLoadingProfile,
      );
      console.log(profileResponse, 'profileResponse');
      if (profileResponse.success) {
        dispatch(
          updateUser({
            profile_image_original: profileResponse?.data?.result?.original,
            profile_image_thumbnail: profileResponse?.data?.result?.thumbnail,
          }),
        );
        toaster.show({
          message: 'Profile Image updated successfully',
          type: 'success',
        });
      }
    }
    if (isFormDirty) {
      const userUpdateResponse = await httpRequest(api_params, setIsLoading);
      console.log(userUpdateResponse, 'userUpdateResponse');
      if (userUpdateResponse.success) {
        reset(user);
        dispatch(
          updateUser({
            first_name: data.first_name,
            last_name: data.last_name,
            phone: [data.phone],
            email: data.email,
            profile_image_original: userUpdateResponse?.data?.result?.original,
            profile_image_thumbnail:
              userUpdateResponse?.data?.result?.thumbnail,
          }),
        );
        toaster.show({
          message: 'Account updated successfully',
          type: 'success',
        });
      }
    }
    // navigation.goBack();
  };

  return (
    <GestureHandlerRootView style={styles.BottomSheetContainer}>
      <ContainerNew
        style={[styles.container, {backgroundColor: theme.colors.background}]}
        header={
          <Header1
            title="Edit Account"
            leftFuncPress={() => handleBackPress()}
            rightFuncTitle={'Save'}
            rightFuncPress={() => handleEditSave()}
          />
        }>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={styles.loaderContainer}
          />
        ) : isLoadingProfile ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={styles.loaderContainer}
          />
        ) : null}
        {/* <View style={styles.loaderContainer}>

        </View> */}
        {/* Edit Account */}
        <View style={styles.editAccount}>
          <View>
            <Avatar.Image
              style={[styles.avatar, {backgroundColor: theme.colors.secondary}]}
              size={90}
              source={{
                uri: isProfileChange
                  ? !profilePhoto.uri.includes('uploads')
                    ? profilePhoto.uri
                    : `${BaseURL}/${user?.profile_image_thumbnail}`
                  : `${BaseURL}/${user?.profile_image_thumbnail}`,
              }}
            />
            <View
              style={[
                styles.cameraContainer,
                {backgroundColor: theme.colors.surface},
              ]}>
              <TouchableOpacity onPress={() => handleOpenBottomSheet()}>
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
                text={user?.first_name}
                txtSize={16}
                txtWeight={'500'}
                padBottom={10}
              />
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
            <Text
              style={{
                fontSize: 18,
                textAlign: 'center',
                fontWeight: '500',
                color: COLORS.black,
              }}>
              Upload Photo
            </Text>
            <Text
              style={{
                fontSize: 14,
                textAlign: 'center',

                color: COLORS.black,
              }}>
              The file size limit is 200KB
            </Text>

            <CustomButtonNew
              disabled={isLoading}
              btnText="Take Photo"
              isLoading={isLoading}
              onBtnPress={() => onTakePhoto()}
              btnstyle={styles.btn}
              btnTextStyle={styles.btnTxt}
            />
            <CustomButtonNew
              disabled={isLoading}
              btnText="Choose from gallery"
              isLoading={isLoading}
              onBtnPress={() => onPickImage()}
              btnstyle={styles.btn}
              btnTextStyle={styles.btnTxt}
            />
            <CustomButtonNew
              disabled={isLoading}
              btnText="Cancel"
              isLoading={isLoading}
              onBtnPress={() => handleClosePress()}
              btnstyle={styles.btn}
              btnTextStyle={styles.btnTxt}
            />
          </BottomSheetView>
        </BottomSheet>
      </ContainerNew>
    </GestureHandlerRootView>
  );
};
export default EditMyAccount;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
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
  btn: {
    width: '100%',
    marginVertical: 10,
  },
  btnTxt: {
    color: COLORS.white,
  },
});
