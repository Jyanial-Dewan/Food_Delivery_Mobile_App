import {Platform} from 'react-native';
import {
  // check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    const result = await request(PERMISSIONS.ANDROID.CAMERA);
    return result === RESULTS.GRANTED;
  }

  if (Platform.OS === 'ios') {
    const result = await request(PERMISSIONS.IOS.CAMERA);
    return result === RESULTS.GRANTED;
  }

  return false;
};

export const requestOpenSettings = async () => {
  const result = await request(PERMISSIONS.ANDROID.CAMERA);
  if (result === RESULTS.BLOCKED) {
    openSettings();
  }
};
