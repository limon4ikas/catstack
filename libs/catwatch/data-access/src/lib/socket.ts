import { io, Socket } from 'socket.io-client';

import {
  ServerToClientEvents,
  ClientToServerEvents,
  ClientEvents,
  ServerEvents,
} from '@catstack/catwatch/types';

const createSocket = () => {
  let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

  return () => {
    if (!socket) {
      socket = io('http://localhost:3333', { withCredentials: true });
    }

    socket.on('connect_error', (_) => socket?.disconnect());

    return socket;
  };
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
