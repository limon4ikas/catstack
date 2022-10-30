import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

import { catwatchConfig } from '@catstack/catwatch/config';

import { AppState } from './store';

export const catWatchApi = createApi({
  reducerPath: 'catWatchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: catwatchConfig.baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as AppState).auth.token;

      if (token) headers.set('Authentication', `Bearer ${token}`);

      return headers;
    },
    credentials: 'include',
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action['payload'][reducerPath];
    }
  },
  endpoints: (builder) => ({
    login: builder.mutation<
      { access_token: string },
      { username: string; password: string }
    >({
      query: (loginDto) => ({
        method: 'POST',
        url: 'auth/login',
        body: loginDto,
      }),
    }),
  }),
});

export const { useLoginMutation } = catWatchApi;
