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

  socket.emit(ClientEvents.CreateRoom);
  const roomId = await new Promise<string>((resolve) =>
    socket.once(ServerEvents.RoomCreated, resolve)
  );

  return { data: roomId };
};

export const joinRoomQueryFn = async (roomId: string) => {
  const socket = getSocket();

  socket.emit(ClientEvents.JoinRoom, roomId);
  const userId = await new Promise<UserProfile>((resolve) =>
    socket.once(ServerEvents.RoomJoined, resolve)
  );

  return { data: userId };
};

export const leaveRoomQueryFn = async (roomId: string) => {
  const socket = getSocket();
  socket.emit(ClientEvents.LeaveRoom, roomId);

  return { data: '' };
};
