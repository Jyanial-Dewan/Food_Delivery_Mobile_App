import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import {io, Socket} from 'socket.io-client';
import {BaseURL} from '../../App';
import {useSelector} from 'react-redux';
import {RootState} from '../stores/Redux/Store/Store';
import {useNetInfo} from '@react-native-community/netinfo';

interface SocketContextProps {
  children: ReactNode;
}

export interface SocketContextType {
  socket: Socket;
}

const SocketContext = createContext({} as SocketContextType);

export function useSocketContext() {
  return useContext(SocketContext);
}

export function SocketContextProvider({children}: SocketContextProps) {
  const userId = useSelector((state: RootState) => state.user.user.user_id);
  const hasInternet = useNetInfo().isConnected;
  const socket = useMemo(() => {
    // console.log(username, 'socket');
    // return io('wss://procg.datafluent.team', {
    return io(BaseURL, {
      path: '/socket.io/',
      query: {
        userId,
      },
      transports: ['websocket'],
    });
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      console.log('No username set, skipping socket connection');
      return;
    }
    if (hasInternet) {
      socket.connect();
    }
    socket.on('connect', () => {
      console.log('Connected to WebSocket', socket.id, userId);
    });
  });

  return (
    <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
  );
}
