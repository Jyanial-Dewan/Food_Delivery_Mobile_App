import {configureStore} from '@reduxjs/toolkit';
import {HydrateSlice} from '../Slices/HydrateSlice';
import {ThemeSlice} from '../Slices/ThemeSlice';
import {userSlice} from '../Slices/UserSlice';

export const store = configureStore({
  reducer: {
    hydrate: HydrateSlice.reducer,
    user: userSlice.reducer,
    theme: ThemeSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
