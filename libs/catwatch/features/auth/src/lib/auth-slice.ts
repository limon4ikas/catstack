import { createSlice } from '@reduxjs/toolkit';

import { UserProfile } from '@catstack/catwatch/types';
import { AppState } from '@catstack/catwatch/store';
import { catWatchApi } from '@catstack/catwatch/data-access';

export interface AuthSliceState {
  user: UserProfile | null;
}

const initialState: AuthSliceState = {
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
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
