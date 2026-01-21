import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Define Song type (ensure consistency with SongType in your types)
interface HydrateState {
  isHydrated: boolean;
}

// Define initial state using Song type
const initialState: HydrateState = {
  isHydrated: false,
};

// Create slice with typed actions and reducers
export const HydrateSlice = createSlice({
  name: 'HydrateSlice',
  initialState,
  reducers: {
    setHydrated: (state, action: PayloadAction<boolean>) => {
      state.isHydrated = action.payload;
    },
  },
});

export const {setHydrated} = HydrateSlice.actions;

export default HydrateSlice.reducer;
