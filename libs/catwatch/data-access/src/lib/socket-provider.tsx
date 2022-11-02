import { createContext, PropsWithChildren, useContext, useRef } from 'react';
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
