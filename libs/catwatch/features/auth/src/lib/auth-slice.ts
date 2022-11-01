import { createSlice } from '@reduxjs/toolkit';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AppState, catWatchApi } from '@catstack/catwatch/data-access';
import { UserProfile } from '@catstack/catwatch/types';

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
