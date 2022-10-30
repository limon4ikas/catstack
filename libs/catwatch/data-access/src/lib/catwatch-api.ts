import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

import { catwatchConfig } from '@catstack/catwatch/config';
import { AuthPayload } from '@catstack/catwatch/types';

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
    userInfo: builder.query<AuthPayload, void>({
      query: () => 'auth/profile',
    }),
  }),
});

export const { useLoginMutation, useUserInfoQuery } = catWatchApi;
