import { catwatchConfig } from '@catstack/catwatch/config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

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
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action['payload'][reducerPath];
    }
  },
  endpoints: (builder) => ({}),
});
