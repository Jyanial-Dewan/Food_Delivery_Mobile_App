import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Define Song type (ensure consistency with SongType in your types)
interface UserTokenState {
  isLoggedIn: boolean;
  user_id: number;
  access_token: string;
  refresh_token: string;
  issuedAt: string;
}

// Define initial state using Song type
const initialState: UserTokenState = {
  isLoggedIn: false,
  user_id: 0,
  access_token: '',
  refresh_token: '',
  issuedAt: '',
};

// Create slice with typed actions and reducers
export const UserSlice = createSlice({
  name: 'userToken',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<UserTokenState>) => {
      return action.payload;
    },
    token: state => state,
    clearToken: () => initialState,
  },
});

export const {setToken, token, clearToken} = UserSlice.actions;

export default UserSlice.reducer;
