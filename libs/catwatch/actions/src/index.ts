import { createEntityAdapter, createAction } from '@reduxjs/toolkit';

import { UserProfile } from '@catstack/catwatch/types';

export const userAdapter = createEntityAdapter<UserProfile>();

export const userJoined = createAction<UserProfile>('USER_JOINED');
export const userLeft = createAction<UserProfile>('USER_LEFT');
