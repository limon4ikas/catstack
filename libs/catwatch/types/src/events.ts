/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { UserProfile } from './auth';

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

export const enum Events {
  getRoomUsers = 'getRoomUsers',
}

export interface ServerToClientEvents {
  [ServerEvents.CreateRoom]: (createdRoomId: string) => void;
  [ServerEvents.DeleteRoom]: (deletedRoomId: string) => void;

  [ServerEvents.JoinRoom]: (joinedUser: UserProfile) => void;
  [ServerEvents.LeaveRoom]: (leftUser: UserProfile) => void;

  [Events.getRoomUsers]: (users: UserProfile[]) => void;
  rtc: (data: any) => void;
}

export interface ClientToServerEvents {
  [ClientEvents.onRoomCreate]: () => void;
  [ClientEvents.onRoomDelete]: (roomId: string) => void;

  [ClientEvents.onRoomJoin]: (roomId: string) => void;
  [ClientEvents.onRoomLeave]: (roomId: string) => void;

  [Events.getRoomUsers]: (roomId: string) => void;

  rtc: (data: any) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
