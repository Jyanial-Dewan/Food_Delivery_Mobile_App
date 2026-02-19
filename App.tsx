import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import RootStack from './src/navigations/RootStack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  BackHandler,
  LogBox,
  Text,
  TextInput,
  useColorScheme,
} from 'react-native';
import {ToastProvider} from './src/common/components/CustomToast';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import {PaperProvider, MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import {baseURL} from '@env';
import {secureStorage} from './src/utils/Storage/mmkv';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {RootState, store} from './src/stores/Redux/Store/Store';
import {Linking} from 'react-native';
import {setToken, setUsers} from './src/stores/Redux/Slices/UserSlice';
import {COLORS} from './src/common/constant/Themes';
import {setTheme} from './src/stores/Redux/Slices/ThemeSlice';
import Alert from './src/common/components/Alert';
import {httpRequest} from './src/common/constant/httpRequest';
import {api} from './src/common/apis/api';
import {setCart} from './src/stores/Redux/Slices/CartSlice';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

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
    blue: COLORS.blue,
    amber: COLORS.amber,
  },
};

const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: COLORS.lightThemeBackground, //background
    onBackground: COLORS.lightThemeOnBackground,
    primary: COLORS.primary, //primary color green
    surface: COLORS.titleLightSecondary, //text color
    secondary: COLORS.secondaryLightButton, //secondaryLightButton
  },
};

const Main = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  // const navigation = useNavigation<RootStackNavigationProp>();
  const selectedTheme = useSelector((state: RootState) => state.theme.theme);
  const user = useSelector((state: RootState) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedTheme) {
      dispatch(setTheme(colorScheme === 'dark' ? 'dark' : 'light'));
    }
  }, [selectedTheme, colorScheme, dispatch]);
  const theme = selectedTheme === 'dark' ? customDarkTheme : customLightTheme;

  useEffect(() => {
    const localTheme = secureStorage.getItem('theme');
    if (localTheme) {
      dispatch(setTheme(localTheme));
    }
    const user_token = JSON.parse(secureStorage.getItem('user_token'));
    dispatch(setToken(user_token));
  }, [dispatch]);

  useEffect(() => {
    const getCartItem = async () => {
      const api_params = {
        url: `${api.CartItems}?user_id=${user.user_id}`,
        baseURL: BaseURL,
        // isConsole: true,
        // isConsoleParams: true,
      };

      const res = await httpRequest(api_params, setIsLoading);
      if (res) {
        dispatch(setCart(res.data.result));
      }
    };

    if (user.user_id) {
      getCartItem();
    }
  }, [dispatch, user.user_id]);

  useEffect(() => {
    const getAllUsers = async () => {
      const api_params = {
        url: `${api.User}`,
        baseURL: BaseURL,
        // isConsole: true,
        // isConsoleParams: true,
      };

      const res = await httpRequest(api_params, setIsLoading);
      if (res) {
        dispatch(setUsers(res.data.result));
      }
    };

    getAllUsers();
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
      {/* <StatusBar
        barStyle={selectedTheme !== 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
        animated={true}
      /> */}
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
      <GestureHandlerRootView style={{flex: 1}}>
        <Main />
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;
