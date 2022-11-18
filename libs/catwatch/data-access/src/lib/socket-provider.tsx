import {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
  useSyncExternalStore,
} from 'react';

import { CatwatchClientSocket } from '@catstack/catwatch/types';
import { useEffectOnce } from '@catstack/shared/hooks';

import { getSocket } from './socket';

const SocketContext = createContext<CatwatchClientSocket | null>(null);

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const socketRef = useRef<CatwatchClientSocket | null>(null);

  if (!socketRef.current) {
    socketRef.current = getSocket();
  }

  useEffectOnce(() => {
    const socket = socketRef.current;

    if (!socket) return;

    socket.connect();
    return () => {
      socket.close();
    };
  });

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);

  if (!socket) throw new Error('No socket found!');

  return socket;
};

const onStatusChange = (listener: () => void) => {
  const socket = getSocket();

  socket.on('connect', listener);
  socket.on('disconnect', listener);
  return () => {
    socket.off('connect', listener);
    socket.off('disconnect', listener);
  };
};

export const useSocketIsOnline = () => {
  const socket = useSocket();

  return useSyncExternalStore<boolean>(
    onStatusChange,
    () => socket.connected,
    () => false
  );
};
