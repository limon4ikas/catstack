import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { EntityState } from '@reduxjs/toolkit';

import { catwatchConfig } from '@catstack/catwatch/config';
import { UserProfile, ServerEvents } from '@catstack/catwatch/types';
import { toast } from '@catstack/shared/vanilla';
import { userAdapter, userJoined, userLeft } from '@catstack/catwatch/actions';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AppState } from '@catstack/catwatch/store';

import {
  createRoomQueryFn,
  getSocket,
  joinRoomQueryFn,
  leaveRoomQueryFn,
} from './socket';

export const catWatchApi = createApi({
  reducerPath: 'catWatchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: catwatchConfig.baseUrl,
    credentials: 'include',
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action['payload'][reducerPath];
    }
  },
  endpoints: (builder) => ({
    login: builder.mutation<void, { username: string; password: string }>({
      query: (credentials) => ({
        method: 'POST',
        url: 'auth/login',
        body: credentials,
        responseHandler: (response) => response.text(),
      }),
    }),
    userInfo: builder.query<UserProfile, void>({ query: () => 'auth/profile' }),
    createRoom: builder.mutation<string, void>({ queryFn: createRoomQueryFn }),
    joinRoom: builder.mutation<UserProfile, string>({
      queryFn: joinRoomQueryFn,
    }),
    leaveRoom: builder.mutation<string, string>({ queryFn: leaveRoomQueryFn }),
    getRoomUsers: builder.query<EntityState<UserProfile>, string>({
      query: (roomId) => `rooms/${roomId}/users`,
      transformResponse(response: UserProfile[]) {
        return userAdapter.addMany(userAdapter.getInitialState(), response);
      },
      async onCacheEntryAdded(
        _roomId,
        {
          updateCachedData,
          cacheDataLoaded,
          cacheEntryRemoved,
          getState,
          dispatch,
        }
      ) {
        const socket = getSocket();
        const currenUserId = (getState() as AppState).auth.user?.id;

        if (!currenUserId) return;

        const onRoomJoinListener = async (user: UserProfile) => {
          if (currenUserId !== user.id) toast(`${user.username} joined room`);
          updateCachedData((draft) => userAdapter.addOne(draft, user));
          dispatch(userJoined(user));
        };

        const onRoomLeaveListener = (user: UserProfile) => {
          if (currenUserId !== user.id) toast(`${user.username} left room`);
          updateCachedData((draft) => userAdapter.removeOne(draft, user.id));
          dispatch(userLeft(user));
        };

        try {
          await cacheDataLoaded;
          socket.on(ServerEvents.RoomJoined, onRoomJoinListener);
          socket.on(ServerEvents.RoomLeft, onRoomLeaveListener);
        } catch {
          //
        }
        await cacheEntryRemoved;
        socket.off(ServerEvents.RoomJoined, onRoomJoinListener);
        socket.off(ServerEvents.RoomLeft, onRoomLeaveListener);
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useUserInfoQuery,
  useCreateRoomMutation,
  useJoinRoomMutation,
  useGetRoomUsersQuery,
  useLazyGetRoomUsersQuery,
  useLeaveRoomMutation,
} = catWatchApi;
