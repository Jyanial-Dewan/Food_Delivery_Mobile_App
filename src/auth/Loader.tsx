import React, {useEffect, useRef} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {IMAGES} from '../common/constant/Index';
import BootSplash from 'react-native-bootsplash';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {RootState} from '../stores/Redux/Store/Store';
import {hydrateAuth} from '../stores/Redux/Hydrate/HydrateAuth';
import {AppDispatch} from '../stores/Redux/Store/Store';
import delay from '../common/services/delay';
import {secureStorage} from '../utils/Storage/mmkv';
import {useTheme} from 'react-native-paper';

const Loader = ({navigation}: any) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const isHydrated = useSelector(
    (state: RootState) => state.hydrate.isHydrated,
  );
  const userToken = useSelector((state: RootState) => state.user.token);
  const isOnboarded = secureStorage.getItem('isOnboarded');
  const hasNavigated = useRef(false);
  console.log(userToken, 'userToken');
  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      try {
        if (isHydrated) {
          await delay(500);
          BootSplash.hide({fade: true});
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [isHydrated]);

  useEffect(() => {
    if (isHydrated && !hasNavigated.current) {
      hasNavigated.current = true;

      delay(1000).then(() => {
        if (
          isOnboarded !== 'true' &&
          !userToken?.access_token &&
          !userToken?.isLoggedIn
        ) {
          navigation.replace('Onboarding');
        } else if (userToken?.access_token && userToken?.isLoggedIn) {
          navigation.replace('DrawerTabs');
        } else {
          navigation.replace('LoginScreen');
        }
      });
    }
  }, [
    isHydrated,
    isOnboarded,
    navigation,
    userToken?.access_token,
    userToken?.isLoggedIn,
  ]);

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Image style={styles.logo} source={IMAGES.AppLogo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    alignSelf: 'center',
    resizeMode: 'center',
  },
});

export default Loader;
