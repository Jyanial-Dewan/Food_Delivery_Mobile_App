import React, {useEffect} from 'react';
import {Image, Platform, StyleSheet, View} from 'react-native';
import {COLORS, IMAGES, SIZES} from '../common/constant/Index';
import BootSplash from 'react-native-bootsplash';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {RootState} from '../stores/Redux/Store/Store';
import {hydrateAuth} from '../stores/Redux/Hydrate/HydrateAuth';
import {AppDispatch} from '../stores/Redux/Store/Store';
import delay from '../common/services/delay';
import {secureStorage} from '../utils/Storage/mmkv';

const Loader = ({navigation}: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const isHydrated = useSelector(
    (state: RootState) => state.hydrate.isHydrated,
  );
  const userToken = useSelector((state: RootState) => state.userToken);
  const isOnboarded = secureStorage.getItem('isOnboarded');

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
    if (isHydrated) {
      delay(1000).then(() => {
        if (
          isOnboarded !== 'true' &&
          !userToken?.access_token &&
          !userToken.isLoggedIn
        ) {
          navigation.replace('Onboarding');
        } else {
          if (userToken?.access_token && userToken.isLoggedIn) {
            navigation.replace('DrawerTabs');
          } else {
            navigation.replace('LoginScreen');
          }
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
    <View style={styles.center}>
      <Image style={styles.logo} source={IMAGES.AppLogo} />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: Platform.OS === 'ios' ? 'flex-start' : 'center',
    paddingTop: Platform.OS === 'ios' ? SIZES.height / 2.6 : 0.001,
    backgroundColor: COLORS.white,
    flex: 1,
  },
  logo: {
    // width: Platform.OS === 'ios' ? 90 : 100,
    // height: Platform.OS === 'ios' ? 98 : 90,
    alignSelf: 'center',
  },
});

export default Loader;
