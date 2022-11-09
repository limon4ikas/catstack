import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
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
  const [socket, setSocket] = useState<
    Socket<ServerToClientEvents, ClientToServerEvents>
  >(getSocket());

  useEffect(() => {
    const socket = getSocket();
    socket.connect();
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);

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
    () => socket?.connected || false,
    () => true
  );
};
