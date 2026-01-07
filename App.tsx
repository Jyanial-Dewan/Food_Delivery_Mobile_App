import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import RootStack from './src/navigations/RootStack';
import React, {useCallback} from 'react';
import {Linking} from 'react-native';
// import delay from './src/services/delay';
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
  return (
    <NavigationContainer linking={linking} onReady={onReady}>
      <RootStack />
    </NavigationContainer>
  );
};

export default App;
