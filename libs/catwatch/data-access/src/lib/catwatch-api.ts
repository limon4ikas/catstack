import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';

import { catwatchConfig } from '@catstack/catwatch/config';
import { UserProfile, ServerEvents } from '@catstack/catwatch/types';
import { toast } from '@catstack/shared/vanilla';

import {
  createRoomQueryFn,
  getSocket,
  joinRoomQueryFn,
  leaveRoomQueryFn,
} from './socket';
import { AppState } from './store';

const userAdapter = createEntityAdapter<UserProfile>();

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
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState }
      ) {
        const socket = getSocket();
        const currenUserId = (getState() as AppState).auth.user?.id;

        const onRoomJoinListener = async (user: UserProfile) => {
          if (currenUserId !== user.id) toast(`${user.username} joined room`);
          updateCachedData((draft) => userAdapter.addOne(draft, user));

          // TODO: Establish WebRTC connection
        };

        const onRoomLeaveListener = (user: UserProfile) => {
          if (currenUserId !== user.id) toast(`${user.username} left room`);
          updateCachedData((draft) => userAdapter.removeOne(draft, user.id));

          // TODO: Remove WebRTC connection
        };

        try {
          await cacheDataLoaded;
          socket.on(ServerEvents.JoinRoom, onRoomJoinListener);
          socket.on(ServerEvents.LeaveRoom, onRoomLeaveListener);
        } catch {
          //
        }
        await cacheEntryRemoved;
        socket.off(ServerEvents.JoinRoom, onRoomJoinListener);
        socket.off(ServerEvents.LeaveRoom, onRoomLeaveListener);
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
