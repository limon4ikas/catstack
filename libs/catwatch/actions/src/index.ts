import { createEntityAdapter, createAction, EntityId } from '@reduxjs/toolkit';

import { UserProfile, RoomMessage } from '@catstack/catwatch/types';

export const userAdapter = createEntityAdapter<UserProfile>();
export const userJoined = createAction<UserProfile>('room/userJoined');
export const userLeft = createAction<UserProfile>('room/userLeft');

export const messagesAdapter = createEntityAdapter<RoomMessage>();
export const messageAdded = createAction<RoomMessage>('room/messageAdded');
export const messageDeleted = createAction<EntityId>('room/messageDeleted');
