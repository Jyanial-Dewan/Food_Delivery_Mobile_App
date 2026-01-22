import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import RootStack from './src/navigations/RootStack';
import React, {useCallback, useEffect, useState} from 'react';
import {LogBox, Text, TextInput, useColorScheme} from 'react-native';
import {ToastProvider} from './src/common/components/CustomToast';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import {PaperProvider, MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import {baseURL} from '@env';
import {secureStorage} from './src/utils/Storage/mmkv';
import {Provider, useDispatch} from 'react-redux';
import {store} from './src/stores/Redux/Store/Store';
import {Linking} from 'react-native';
import {setToken} from './src/stores/Redux/Slices/UserSlice';
import {COLORS} from './src/common/constant/Themes';
import {StatusBar} from 'react-native';
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

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: COLORS.darkThemeBackground, //background
    onBackground: COLORS.darkThemeOnBackground,
    primary: COLORS.primary, //primary color green
    surface: COLORS.titleDarkPrimary, //text color
    secondary: COLORS.secondaryDarkButton, //secondaryDarkButton
  },
};

const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: COLORS.white, //background
    onBackground: COLORS.darkThemeOnBackground,
    primary: COLORS.primary, //primary color green
    surface: COLORS.titleLightSecondary, //text color
    secondary: COLORS.secondaryLightButton, //secondaryLightButton
  },
};

const Main = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  // const navigation = useNavigation<RootStackNavigationProp>();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  console.log(colorScheme, 'colorScheme');
  const theme = isDarkMode ? customDarkTheme : customLightTheme;

  useEffect(() => {
    const user_token = JSON.parse(secureStorage.getItem('user_token'));
    dispatch(setToken(user_token));
    if (user_token?.access_token && user_token?.user_id) {
    }
  }, [dispatch]);

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

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
        animated={true}
      />
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ToastProvider>
          <NavigationContainer linking={linking} onReady={onReady}>
            <RootStack />
          </NavigationContainer>
        </ToastProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
};
const App = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

export default App;
