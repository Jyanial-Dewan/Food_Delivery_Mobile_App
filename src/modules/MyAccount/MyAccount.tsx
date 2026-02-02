import React, {useEffect} from 'react';
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
import {COLORS} from '../../common/constant/Themes';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {BaseURL} from '../../../App';
import {RootState} from '../../stores/Redux/Store/Store';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {DrawerTabsScreensParms} from '../../types/DrawerTabsTypes';

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

const MyAccount = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<DrawerTabsScreensParms>;
}) => {
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.user.user);

  const handleEdit = () => {
    navigation.navigate('EditMyAccount');
    // setEditAccount(!editAccount);
    // if (editAccount) {
    //   handleSubmit(onSubmit)();
    // } else {
    // }
  };
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <GestureHandlerRootView style={styles.BottomSheetContainer}>
      <ContainerNew
        style={[styles.container, {backgroundColor: theme.colors.background}]}
        header={
          <Header1
            title="My Account"
            // leftFuncPress={() => handleIsEditAccount()}
            rightFuncTitle={'Edit'}
            rightFuncPress={() => handleEdit()}
          />
        }>
        <View style={{gap: 20, padding: 10}}>
          <View style={styles.header}>
            <Avatar.Image
              style={[styles.avatar, {backgroundColor: theme.colors.secondary}]}
              size={90}
              source={{
                uri: `${BaseURL}/${user?.profile_image_thumbnail}`,
              }}
            />
            <View style={styles.headerContent}>
              <Text style={[styles.headerText, {color: theme.colors.surface}]}>
                {user?.first_name} {user?.last_name}
              </Text>
              <Text
                style={[styles.headerSubText, {color: theme.colors.surface}]}>
                {user?.email}
              </Text>
              <Text
                style={[styles.headerSubText, {color: theme.colors.surface}]}>
                {user?.phone?.[0]}
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
                  <Text style={[styles.text, {color: theme.colors.surface}]}>
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
      </ContainerNew>
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
  btn: {
    width: '100%',
    marginVertical: 10,
  },
  btnTxt: {
    color: COLORS.white,
  },
});
