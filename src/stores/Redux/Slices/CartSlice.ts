import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ICartItem} from '../../../types/CartTypes';

interface CartSliceState {
  cart: ICartItem[];
}

const initialState: CartSliceState = {
  cart: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<ICartItem[]>) => {
      state.cart = action.payload;
    },

    removeItem: (state, action: PayloadAction<number>) => {
      const foodId = action.payload;
      state.cart = state.cart.filter(item => item.food_id !== foodId);
    },

    increaseQuantity: (state, action: PayloadAction<number>) => {
      const foodId = action.payload;

      const item = state.cart.find(i => i.food_id === foodId);
      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const foodId = action.payload;

      const item = state.cart.find(i => i.food_id === foodId);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    addToCart: (state, action: PayloadAction<ICartItem>) => {
      const foodId = action.payload.food_id;

      const isExist = state.cart.find(item => item.food_id === foodId);

      if (isExist) {
        return;
      }

      state.cart.push(action.payload);
    },
  },
});

export const {
  setCart,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  addToCart,
} = cartSlice.actions;

export default cartSlice.reducer;
