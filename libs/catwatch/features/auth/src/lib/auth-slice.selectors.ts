import { createSelector } from '@reduxjs/toolkit';

import {
  RootStateWithAuth,
  AuthSliceState,
  AUTH_SLICE_NAME,
} from './auth-slice';

export const getAuthState = (state: RootStateWithAuth): AuthSliceState =>
  state[AUTH_SLICE_NAME];

export const selectUser = createSelector(getAuthState, (state) => state.user);
