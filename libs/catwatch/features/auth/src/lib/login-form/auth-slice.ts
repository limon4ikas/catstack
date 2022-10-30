import { createSlice } from '@reduxjs/toolkit';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AppState, catWatchApi } from '@catstack/catwatch/data-access';
import { AuthPayload } from '@catstack/catwatch/types';

export const AUTH_SLICE = 'auth';

export interface AuthSliceState {
  user: AuthPayload | null;
}

const initialState: AuthSliceState = {
  user: null,
};

export const authSlice = createSlice({
  name: AUTH_SLICE,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(
      catWatchApi.endpoints.userInfo.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
      }
    );
  },
});

export const selectUser = (state: AppState) => state.auth.user;
