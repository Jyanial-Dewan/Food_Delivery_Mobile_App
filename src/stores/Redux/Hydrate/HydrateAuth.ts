import {secureStorage} from '../../../utils/Storage/mmkv';
import {AppDispatch} from '../Store/Store';
import {setToken, setUser} from '../Slices/UserSlice';
import {setHydrated} from '../Slices/HydrateSlice';

export const hydrateAuth = () => async (dispatch: AppDispatch) => {
  try {
    const userToken = await secureStorage.getItem('user_token');
    const user = await secureStorage.getItem('user');

    if (userToken) {
      dispatch(setToken(JSON.parse(userToken)));
      if (user) {
        dispatch(setUser(JSON.parse(user)));
      }
    }
  } catch (e) {
    console.log('Hydration error', e);
  } finally {
    dispatch(setHydrated(true));
  }
};
