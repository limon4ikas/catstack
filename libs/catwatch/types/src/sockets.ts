/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */

export const enum ClientEvents {
  onRoomCreate = 'onRoomCreate',
  onRoomLeave = 'onRoomLeave',
  onRoomJoin = 'onRoomJoin',
  onRoomDelete = 'onRoomDelete',
}

export const enum ServerEvents {
  CreateRoom = 'room.create',
  LeaveRoom = 'room.leave',
  JoinRoom = 'room.join',
  DeleteRoom = 'room.delete',
}

export const enum ServerEvents {}

export interface ServerToClientEvents {
  [ServerEvents.CreateRoom]: (roomId: string) => void;
  [ServerEvents.DeleteRoom]: () => void;
  [ServerEvents.JoinRoom]: (roomId: string) => void;
  [ServerEvents.LeaveRoom]: (roomId: string) => void;
}

export interface ClientToServerEvents {
  [ClientEvents.onRoomCreate]: () => void;
  [ClientEvents.onRoomDelete]: (roomId: string) => void;
  [ClientEvents.onRoomJoin]: (roomId: string) => void;
  [ClientEvents.onRoomLeave]: (roomId: string) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
