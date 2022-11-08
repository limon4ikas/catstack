import {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
  useSyncExternalStore,
} from 'react';
import { Socket } from 'socket.io-client';

import {
  ServerToClientEvents,
  ClientToServerEvents,
} from '@catstack/catwatch/types';

import { getSocket } from './socket';

const SocketContext = createContext<Socket<
  ServerToClientEvents,
  ClientToServerEvents
> | null>(null);

export const SocketProvider = (props: PropsWithChildren) => {
  const socketRef = useRef(getSocket());

  return (
    <SocketContext.Provider value={socketRef.current}>
      {props.children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);

  if (!socket) throw new Error('No socket found, check context');

  return socket;
};

const onStatusChange = (listener: (isConnected: boolean) => void) => {
  const socket = getSocket();

  const handleConnected = () => listener(true);
  const handleDisconnected = () => listener(false);

  socket.on('connect', handleConnected);
  socket.on('disconnect', handleDisconnected);

  return () => {
    socket.off('connect', handleConnected);
    socket.off('disconnect', handleDisconnected);
  };
};

export const useSocketIsOnline = () => {
  const socket = useSocket();

  return useSyncExternalStore<boolean>(
    onStatusChange,
    () => socket.connected,
    () => true
  );
};
