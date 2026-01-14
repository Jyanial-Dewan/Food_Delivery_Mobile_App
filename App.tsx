import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import RootStack from './src/navigations/RootStack';
import React, {useCallback} from 'react';
import {BackHandler, Linking, LogBox, Text, TextInput} from 'react-native';
import {ToastProvider} from './src/common/components/CustomToast';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import {PaperProvider} from 'react-native-paper';
import {baseURL} from '@env';
import {secureStorage} from './src/utils/Storage/mmkv';
import DrawerTabs from './src/navigations/DrawerTabs';
// import delay from './src/services/delay';

LogBox.ignoreLogs(['EventEmitter.removeListener', 'ViewPropTypes']);
if ((Text as any).defaultProps == null) {
  (Text as any).defaultProps = {};
  (Text as any).defaultProps.allowFontScaling = false;
}

if ((TextInput as any).defaultProps == null) {
  (TextInput as any).defaultProps = {};
  (TextInput as any).defaultProps.allowFontScaling = false;
}

export const BaseURL = baseURL;

const linking: LinkingOptions<any> = {
  prefixes: [
    /* your linking prefixes */
    // 'https://procg.datafluent.team',
    // 'PROCG://',
    'food://',
  ],
  config: {
    /* configuration for matching screens with paths */
    initialRouteName: 'Loader',
    screens: {
      Home: '',
      Profile: 'profile',
      Register: 'register',
    },
  },
};

const App = () => {
  const onReady = useCallback(async () => {
    try {
      const uri = await Linking.getInitialURL();
      if (uri) {
        // await delay(200);
        // await BootSplash.hide({fade: true});
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  }, []);

  // const backAction = () => {
  //   secureStorage.clearAll();
  //   BackHandler.exitApp();
  //   return true;
  // };
  // // if (JailMonkey?.trustFall() || JailMonkey.AdbEnabled()) {
  // //   clearAllStorage();
  // // }
  // BackHandler.addEventListener('hardwareBackPress', backAction);

  const user = secureStorage.getItem('user');

  return (
    <PaperProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ToastProvider>
          <NavigationContainer linking={linking} onReady={onReady}>
            {user ? <DrawerTabs /> : <RootStack />}
          </NavigationContainer>
        </ToastProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
