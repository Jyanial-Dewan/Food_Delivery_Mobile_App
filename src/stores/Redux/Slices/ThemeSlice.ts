import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {secureStorage} from '../../../utils/Storage/mmkv';

// Define Song type (ensure consistency with SongType in your types)
interface ThemeSelectionState {
  theme: string;
}

// Define initial state using Song type
const initialState: ThemeSelectionState = {
  theme: 'light',
};

// Create slice with typed actions and reducers
export const ThemeSlice = createSlice({
  name: 'ThemeSlice',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
      secureStorage.setItem('theme', action.payload);
    },
  },
});

export const {setTheme} = ThemeSlice.actions;

export default ThemeSlice.reducer;
