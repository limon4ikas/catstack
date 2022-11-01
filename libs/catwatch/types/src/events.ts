/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { UserProfile } from './auth';

export interface InterServerEvents {}

export interface SocketData {}

/**
|--------------------------------------------------
| Socket events
|--------------------------------------------------
*/

export const enum ClientEvents {
  onRoomCreate = 'onRoomCreate',
  onRoomLeave = 'onRoomLeave',
  onRoomJoin = 'onRoomJoin',
  onRoomDelete = 'onRoomDelete',
}

export const enum ServerEvents {
  RoomCreated = 'room.create',
  RoomDeleted = 'room.delete',
  RoomLeft = 'room.leave',
  RoomJoined = 'room.join',
}

export const enum Events {
  getRoomUsers = 'getRoomUsers',
  WebRtc = 'WebRTC',
  WebRtcOffer = 'webrtc-offer',
  WebRtcAnswer = 'webrtc-answer',
  WebRtcCandidate = 'webrtc-candidate',
}

export interface ServerToClientEvents {
  // ROOM EVENTS
  [ServerEvents.RoomCreated]: (createdRoomId: string) => void;
  [ServerEvents.RoomDeleted]: (deletedRoomId: string) => void;
  [ServerEvents.RoomJoined]: (joinedUser: UserProfile) => void;
  [ServerEvents.RoomLeft]: (leftUser: UserProfile) => void;
  // SHARED EVENTS
  [Events.getRoomUsers]: (users: UserProfile[]) => void;
  [Events.WebRtc]: (data: RTCSignalMessage) => void;
}

export interface ClientToServerEvents {
  // ROOM EVENTS
  [ClientEvents.onRoomCreate]: () => void;
  [ClientEvents.onRoomDelete]: (deletedRoomId: string) => void;
  [ClientEvents.onRoomJoin]: (roomToJoinId: string) => void;
  [ClientEvents.onRoomLeave]: (roomToLeaveId: string) => void;
  // SHARED EVENTS
  [Events.getRoomUsers]: (roomId: string) => void;
  [Events.WebRtc]: (data: RTCSignalMessage) => void;
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
