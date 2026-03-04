import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IOrder, IOrderStatus} from '../../../types/OrderTypes';

interface OrderSliceState {
  statuses: IOrderStatus[];
  orders: IOrder[];
}

const initialState: OrderSliceState = {
  statuses: [],
  orders: [],
};

export const orderSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setStatuses: (state, action: PayloadAction<IOrderStatus[]>) => {
      state.statuses = action.payload;
    },

    setOrders: (state, action: PayloadAction<IOrder[]>) => {
      state.orders = action.payload;
    },
  },
});

export const {setOrders, setStatuses} = orderSlice.actions;

export default orderSlice.reducer;
