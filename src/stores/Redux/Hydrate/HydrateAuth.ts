import {secureStorage} from '../../../utils/Storage/mmkv';
import {AppDispatch} from '../Store/Store';
import {setToken} from '../Slices/UserSlice';
import {setHydrated} from '../Slices/HydrateSlice';

export const hydrateAuth = () => async (dispatch: AppDispatch) => {
  try {
    const userToken = await secureStorage.getItem('user_token');

    if (userToken) {
      dispatch(setToken(userToken));
    }
  } catch (e) {
    console.log('Hydration error', e);
  } finally {
    dispatch(setHydrated(true));
  }
};
