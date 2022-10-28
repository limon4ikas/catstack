/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */

export const enum Events {
  CreateRoom = 'room.create',
  LeaveRoom = 'room.leave',
  JoinRoom = 'room.join',
  DeleteRoom = 'room.delete',
}

export interface ServerToClientEvents {
  [Events.CreateRoom]: (roomId: string) => void;
  [Events.DeleteRoom]: () => void;
  [Events.JoinRoom]: (roomId: string) => void;
  [Events.LeaveRoom]: (roomId: string) => void;
}

export interface ClientToServerEvents {
  [Events.CreateRoom]: () => void;
  [Events.DeleteRoom]: (roomId: string) => void;
  [Events.JoinRoom]: (roomId: string) => void;
  [Events.LeaveRoom]: (roomId: string) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
