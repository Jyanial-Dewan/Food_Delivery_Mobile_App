import React, {useEffect, useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ContainerNew from '../../common/components/Container';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {RootState} from '../../stores/Redux/Store/Store';
import messaging from '@react-native-firebase/messaging';
import UserHome from './UserHome';
import {httpMethod, httpRequest} from '../../common/constant/httpRequest';
import {BaseURL} from '../../../App';
import {api} from '../../common/apis/api';
import {secureStorage} from '../../utils/Storage/mmkv';

const Home = () => {
  const theme = useTheme();
  const drawerNav = useNavigation<any>();
  const user = useSelector((state: RootState) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const resPushNotificaton = secureStorage.getItem('pushNotificaton');

  //Post_Notification Permission
  useEffect(() => {
    const showAlert = () =>
      Alert.alert(
        'Push Notifications',
        'Allow PRO-CG to send you notifications?',
        [
          {
            text: 'Ask me later',
            onPress: () => {
              // console.log('Ask me later pressed');
              secureStorage.setItem('pushNotificaton', 'askMeLater');
            },
          },
          {
            text: 'Cancel',
            onPress: () => {
              // console.log('Cancel Pressed');
              secureStorage.setItem('pushNotificaton', 'cancel');
            },
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              // console.log('OK Pressed');
              allowPushNotification();
              secureStorage.setItem('pushNotificaton', 'ok');
            },
          },
        ],
      );

    const allowPushNotification = async () => {
      const token = await messaging().getToken();
      const tokenParams = {
        url: `${api.PushNotification}/register_token`,
        data: {
          token,
          user_id: user.user_id,
        },
        method: 'POST' as httpMethod,
        baseURL: BaseURL,
        isConsole: true,
        isConsoleParams: true,
      };
      await httpRequest(tokenParams, setIsLoading);
    };
    const requestPermissionAndroid = async () => {
      //console.log('render time home-------------------');
      if (Platform.OS === 'android') {
        // Handle for Android 8.1 or lower
        if (Platform.Version < 28) {
          // For Android 8.1 or lower, permission is automatically granted (no need for POST_NOTIFICATIONS)
          if (!resPushNotificaton || resPushNotificaton === 'askMeLater')
            showAlert();
        } else {
          // For Android 9 and above, request POST_NOTIFICATIONS permission
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            allowPushNotification();
          } else {
            Alert.alert('Permission Denied');
          }
        }
      }
    };

    requestPermissionAndroid();
  }, [resPushNotificaton, user.user_id]);

  return (
    <ContainerNew style={styles.container} isScrollView={true}>
      <View style={styles.headerContainer}>
        <View style={{gap: 8}}>
          <Text
            style={[styles.text, {color: theme.colors.surface, fontSize: 14}]}>
            Hi, {user?.username ?? ''}
          </Text>
          {user.user_type === 'USER' && (
            <Text
              style={[
                styles.text,
                {color: theme.colors.surface, fontSize: 16},
              ]}>
              What are you craving?
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={drawerNav.toggleDrawer}
          style={styles.drawerIcon}>
          <MaterialCommunityIcons
            name="account-circle"
            size={40}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {user.user_type === 'USER' && <UserHome />}
    </ContainerNew>
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  drawerIcon: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
  },
});
