import { createEntityAdapter, createAction } from '@reduxjs/toolkit';

import { UserProfile, RoomMessage } from '@catstack/catwatch/types';

export const userAdapter = createEntityAdapter<UserProfile>();
export const userJoined = createAction<UserProfile>('room/userJoined');
export const userLeft = createAction<UserProfile>('room/userLeft');

export const messagesAdapter = createEntityAdapter<RoomMessage>();
export const newMessage = createAction<RoomMessage>('room/messageAdded');
