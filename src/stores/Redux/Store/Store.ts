import {configureStore} from '@reduxjs/toolkit';
import {UserSlice} from '../Slices/UserSlice';
import {HydrateSlice} from '../Slices/HydrateSlice';

export const store = configureStore({
  reducer: {
    hydrate: HydrateSlice.reducer,
    userToken: UserSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
