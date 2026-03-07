import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IOrder, IOrderStatus} from '../../../types/OrderTypes';

interface OrderSliceState {
  statuses: IOrderStatus[];
  orders: IOrder[];
  deliveryRequests: IOrder[];
}

const initialState: OrderSliceState = {
  statuses: [],
  orders: [],
  deliveryRequests: [],
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

    addDeliveryRequest: (state, action: PayloadAction<IOrder>) => {
      const order = action.payload;
      const isExist = state.deliveryRequests.find(
        item => item.order_id === order.order_id,
      );

      if (isExist) {
        return;
      } else {
        state.deliveryRequests = [order, ...state.deliveryRequests];
      }
    },

    removeDeliveryReques: (state, action: PayloadAction<IOrder>) => {
      const orderId = action.payload.order_id;

      state.deliveryRequests = state.deliveryRequests.filter(
        item => item.order_id !== orderId,
      );
    },

    addToDashboard: (state, action: PayloadAction<IOrder>) => {
      const order = action.payload;
      const isExist = state.orders.find(
        item => item.order_id === order.order_id,
      );

      if (isExist) {
        return;
      } else {
        state.orders = [order, ...state.orders];
      }
    },
  },
});

export const {
  setOrders,
  setStatuses,
  addDeliveryRequest,
  removeDeliveryReques,
  addToDashboard,
} = orderSlice.actions;

export default orderSlice.reducer;
