import { io, Socket } from 'socket.io-client';

import {
  ServerToClientEvents,
  ClientToServerEvents,
  ClientEvents,
  ServerEvents,
  UserProfile,
} from '@catstack/catwatch/types';

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
export const getSocket = () => {
  if (!socket) {
    socket = io('http://localhost:3333', { withCredentials: true });
  }

  return socket;
};

export const createRoomQueryFn = async () => {
  const socket = getSocket();

  socket.emit(ClientEvents.onRoomCreate);
  const roomId = await new Promise<string>((resolve) =>
    socket.once(ServerEvents.CreateRoom, resolve)
  );

  return { data: roomId };
};

export const joinRoomQueryFn = async (roomId: string) => {
  const socket = getSocket();

  socket.emit(ClientEvents.onRoomJoin, roomId);
  const userId = await new Promise<UserProfile>((resolve) =>
    socket.once(ServerEvents.JoinRoom, resolve)
  );

  return { data: userId };
};

export const leaveRoomQueryFn = async (roomId: string) => {
  const socket = getSocket();
  socket.emit(ClientEvents.onRoomLeave, roomId);

  return { data: '' };
};
