import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { EntityState } from '@reduxjs/toolkit';

import { catwatchConfig } from '@catstack/catwatch/config';
import { UserProfile, ServerEvents } from '@catstack/catwatch/types';
import { userAdapter, userJoined, userLeft } from '@catstack/catwatch/actions';

import { createRoomQueryFn, getSocket } from './socket';

export const CATWATCH_API_NAME = 'catWatchApi';

export const catWatchApi = createApi({
  reducerPath: CATWATCH_API_NAME,
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
    logout: builder.mutation<void, void>({
      query: () => ({ method: 'POST', url: 'auth/logout' }),
    }),
    userInfo: builder.query<UserProfile, void>({ query: () => 'auth/profile' }),
    createRoom: builder.mutation<string, void>({ queryFn: createRoomQueryFn }),
    getRoomUsers: builder.query<EntityState<UserProfile>, string>({
      query: (roomId) => `rooms/${roomId}/users`,
      transformResponse(response: UserProfile[]) {
        return userAdapter.addMany(userAdapter.getInitialState(), response);
      },
      async onCacheEntryAdded(
        _roomId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        const socket = getSocket();

        const onRoomJoinListener = async (user: UserProfile) => {
          updateCachedData((draft) => userAdapter.addOne(draft, user));
          dispatch(userJoined(user));
        };

        const onRoomLeaveListener = (user: UserProfile) => {
          updateCachedData((draft) => userAdapter.removeOne(draft, user.id));
          dispatch(userLeft(user));
        };

        try {
          await cacheDataLoaded;
          socket.on(ServerEvents.onRoomJoined, onRoomJoinListener);
          socket.on(ServerEvents.onRoomLeft, onRoomLeaveListener);
        } catch {
          //
        }
        await cacheEntryRemoved;
        socket.off(ServerEvents.onRoomJoined, onRoomJoinListener);
        socket.off(ServerEvents.onRoomLeft, onRoomLeaveListener);
      },
    }),
    getIsRoomAvailable: builder.query<unknown, string>({
      query: (roomId) => `rooms/${roomId}/available`,
    }),
  }),
});

export const {
  useLoginMutation,
  useUserInfoQuery,
  useCreateRoomMutation,
  useGetRoomUsersQuery,
  useLazyGetRoomUsersQuery,
  useLazyGetIsRoomAvailableQuery,
  useLazyUserInfoQuery,
  useLogoutMutation,
} = catWatchApi;

export const catWatchApiReducer = catWatchApi.reducer;
export const catWatchApiMiddleware = catWatchApi.middleware;
