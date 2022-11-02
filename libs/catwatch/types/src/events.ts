/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { SignalData } from 'simple-peer';

import { UserProfile } from './auth';

export interface InterServerEvents {}

export interface SocketData {}

/**
|--------------------------------------------------
| Socket events
|--------------------------------------------------
*/

export const enum ClientEvents {
  CreateRoom = 'onRoomCreate',
  LeaveRoom = 'LeaveRoom',
  JoinRoom = 'JoinRoom',
  DeleteRoom = 'onRoomDelete',
}

export const enum ServerEvents {
  RoomCreated = 'room.create',
  RoomDeleted = 'room.delete',
  RoomLeft = 'room.leave',
  RoomJoined = 'room.join',
}

export const enum Events {
  AllUsers = 'getRoomUsers',
  WebRtc = 'WebRTC',
  SendingSignal = 'sending-signal',
  ReturningSignal = 'returning-signal',
  RecievingReturnedSignal = 'recieving-returneds-signal',
}

export interface SignalMessage {
  fromUserId: number;
  toUserId: number;
  signal: SignalData;
}

export interface ServerToClientEvents {
  [ServerEvents.RoomCreated]: (createdRoomId: string) => void;
  [ServerEvents.RoomDeleted]: (deletedRoomId: string) => void;
  [ServerEvents.RoomJoined]: (joinedUser: SignalMessage) => void;
  [ServerEvents.RoomLeft]: (leftUser: UserProfile) => void;
  [Events.AllUsers]: (users: UserProfile[]) => void;
  [Events.WebRtc]: (data: RTCSignalMessage) => void;
  [Events.RecievingReturnedSignal]: (data: SignalMessage) => void;
}

export interface ClientToServerEvents {
  [ClientEvents.CreateRoom]: () => void;
  [ClientEvents.DeleteRoom]: (deletedRoomId: string) => void;
  [ClientEvents.JoinRoom]: (roomToJoinId: string) => void;
  [ClientEvents.LeaveRoom]: (roomToLeaveId: string) => void;
  [Events.SendingSignal]: (data: SignalMessage) => void;
  [Events.ReturningSignal]: (data: SignalMessage) => void;
}

/**
|--------------------------------------------------
| WebRTC Events
|--------------------------------------------------
*/

export type RTCSignalingEvents = 'offer' | 'answer' | 'candidate';
export type RTCSignalPayload = unknown;

export type RTCSignalMessage = {
  type: RTCSignalingEvents;
  fromUserId: number;
  toUserId: number;
  payload: unknown;
};
