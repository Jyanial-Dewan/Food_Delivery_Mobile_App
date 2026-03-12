import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {io, Socket} from 'socket.io-client';
import {BaseURL} from '../../App';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../stores/Redux/Store/Store';
import {useNetInfo} from '@react-native-community/netinfo';
import {api} from '../common/apis/api';
import {httpRequest} from '../common/constant/httpRequest';
import {
  addDeliveryRequest,
  addToDashboard,
  setOrders,
  setStatuses,
} from '../stores/Redux/Slices/OrderSlice';
import {IOrder} from '../types/OrderTypes';

interface SocketContextProps {
  children: ReactNode;
}

export interface SocketContextType {
  socket: Socket;
  emitUpdateStatus: (orderId: number) => void;
  emitAddOrder: (orderId: number) => void;
  emitAcceptDeliveryRequest: (orderId: number) => void;
}

const SocketContext = createContext({} as SocketContextType);

export function useSocketContext() {
  return useContext(SocketContext);
}

export function SocketContextProvider({children}: SocketContextProps) {
  const {user} = useSelector((state: RootState) => state.user);
  const {orders} = useSelector((state: RootState) => state.order);
  const hasInternet = useNetInfo().isConnected;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const socket = useMemo(() => {
    // console.log(username, 'socket');
    // return io('wss://procg.datafluent.team', {
    return io(BaseURL, {
      path: '/socket.io/',
      query: {
        userId: user.user_id,
      },
      transports: ['websocket'],
    });
  }, [user.user_id]);

  useEffect(() => {
    if (!user.user_id) {
      console.log('No username set, skipping socket connection');
      return;
    }
    if (hasInternet) {
      socket.connect();
    }
    socket.on('connect', () => {
      console.log('Connected to WebSocket', socket.id, user.user_id);
    });
  });
  //Load statuses
  useEffect(() => {
    const getStatuses = async () => {
      const api_params = {
        url: `${api.OrderStatuses}?vendor_id=${user.user_id}`,
        baseURL: BaseURL,
        // isConsole: true,
        // isConsoleParams: true,
      };

      const res = await httpRequest(api_params, setIsLoading);
      if (res) {
        dispatch(setStatuses(res.data.result.status_names));
      }
    };

    getStatuses();
  }, [dispatch, user.user_id]);

  //Load Orders
  useEffect(() => {
    const getOrders = async () => {
      const api_params = {
        url:
          user.user_type === 'OWNER'
            ? `${api.Orders}?vendor_id=${user.user_id}`
            : user.user_type === 'DELIVERY'
            ? `${api.Orders}?delivery_man_id=${user.user_id}`
            : `${api.Orders}?customer_id=${user.user_id}`,
        baseURL: BaseURL,
        // isConsole: true,
        // isConsoleParams: true,
      };

      const res = await httpRequest(api_params, setIsLoading);
      if (res) {
        dispatch(setOrders(res.data.result));
      }
    };

    getOrders();
  }, [dispatch, user.user_id, user.user_type]);

  //Listen to Socket Events
  useEffect(() => {
    socket.on('updateStatus', (order: IOrder) => {
      const newOrders = orders.filter(o => o.order_id !== order.order_id);
      dispatch(setOrders([...newOrders, order]));
    });

    socket.on('deliveryRequest', (order: IOrder) => {
      dispatch(addDeliveryRequest(order));
    });

    socket.on('addToDashboard', (order: IOrder) => {
      console.log('listened');
      dispatch(addToDashboard(order));
    });

    return () => {
      socket.off('updateStatus');
      socket.off('deliveryRequest');
      socket.off('acceptDeliveryRequest');
    };
  }, [dispatch, orders, socket]);

  const emitUpdateStatus = (orderId: number) => {
    socket.emit('updateStatus', {order_id: orderId});
  };

  const emitAddOrder = (orderId: number) => {
    socket.emit('addOrder', {order_id: orderId});
  };

  const emitAcceptDeliveryRequest = (orderId: number) => {
    socket.emit('acceptDeliveryRequest', {order_id: orderId});
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        emitUpdateStatus,
        emitAddOrder,
        emitAcceptDeliveryRequest,
      }}>
      {children}
    </SocketContext.Provider>
  );
}
