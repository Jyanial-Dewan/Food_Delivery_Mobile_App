import {configureStore} from '@reduxjs/toolkit';
import {UserSlice} from '../Slices/UserSlice';

export const store = configureStore({
  reducer: {
    userToken: UserSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
