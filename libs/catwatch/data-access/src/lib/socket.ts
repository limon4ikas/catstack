import { io } from 'socket.io-client';

import {
  ClientEvents,
  ServerEvents,
  CatwatchClientSocket,
} from '@catstack/catwatch/types';

const createSocket = () => {
  const socket: CatwatchClientSocket = io('http://localhost:3333', {
    withCredentials: true,
    autoConnect: false,
  });

  return () => socket;
};

export const getSocket = createSocket();

export const createRoomQueryFn = async () => {
  const socket = getSocket();

  socket.emit(ClientEvents.CreateRoom);
  const createdRoomId = await new Promise<string>((resolve) =>
    socket.once(ServerEvents.RoomCreated, resolve)
  );

  return { data: createdRoomId };
};
