/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { SignalData } from 'simple-peer';

import { UserProfile } from './user';

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
  RoomJoined = 'room.join',
  RoomLeft = 'room.left',
  // Events on client side
  onRoomLeft = 'roomLeft',
  onRoomJoined = 'roomJoined',
}

export const enum Events {
  AllUsers = 'getRoomUsers',
  WebRtc = 'WebRTC',
  SendOffer = 'send-offer',
  AnswerOffer = 'answer-offer',
  onAnswer = 'on-answer',
}

export interface SignalMessage {
  fromUserId: number;
  toUserId: number;
  signal: SignalData;
}

export interface ServerToClientEvents {
  [ServerEvents.RoomCreated]: (createdRoomId: string) => void;
  [ServerEvents.RoomDeleted]: (deletedRoomId: string) => void;
  [ServerEvents.onRoomLeft]: (leftUser: UserProfile) => void;
  [ServerEvents.onRoomJoined]: (joinedUser: UserProfile) => void;

  // Signaling
  [Events.AllUsers]: (users: UserProfile[]) => void;
  [ServerEvents.RoomJoined]: (joinedUser: SignalMessage) => void;
  [Events.onAnswer]: (data: SignalMessage) => void;
}

export interface ClientToServerEvents {
  [ClientEvents.CreateRoom]: () => void;
  [ClientEvents.DeleteRoom]: (deletedRoomId: string) => void;
  [ClientEvents.JoinRoom]: (roomToJoinId: string) => void;
  [ClientEvents.LeaveRoom]: (roomToLeaveId: string) => void;
  // Signaling
  [Events.SendOffer]: (data: SignalMessage) => void;
  [Events.AnswerOffer]: (data: SignalMessage) => void;
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
