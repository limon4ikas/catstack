import { createEntityAdapter, createAction, EntityId } from '@reduxjs/toolkit';

import { UserProfile, RoomMessage } from '@catstack/catwatch/types';

export type ConnectionState = 'connected' | 'not-connected';
export interface Connection {
  userId: EntityId;
  state: ConnectionState;
}

// User
export const userAdapter = createEntityAdapter<UserProfile>();
export const userJoined = createAction<UserProfile>('room/userJoined');
export const userLeft = createAction<UserProfile>('room/userLeft');
// Messages
export const messagesAdapter = createEntityAdapter<RoomMessage>();
export const newMessage = createAction<RoomMessage>('room/newMessage');
// Connections
export const connectionsAdapter = createEntityAdapter<Connection>({
  selectId: (model) => model.userId,
});
