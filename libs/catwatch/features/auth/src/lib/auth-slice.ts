import { useSelector } from 'react-redux';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import { UserProfile } from '@catstack/catwatch/types';
import { catWatchApi } from '@catstack/catwatch/data-access';

export const AUTH_SLICE_NAME = 'auth';

export interface RootStateWithAuth {
  [AUTH_SLICE_NAME]: AuthSliceState;
}

export interface AuthSliceState {
  user: UserProfile | null;
}

const initialState: AuthSliceState = {
  user: null,
};

export const authSlice = createSlice({
  name: AUTH_SLICE_NAME,
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

export const getAuthState = (state: RootStateWithAuth): AuthSliceState =>
  state[AUTH_SLICE_NAME];

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectUser = createSelector(getAuthState, (state) => state.user);

export const useAuth = () => {
  const user = useSelector(selectUser);

  if (!user) throw new Error('You are not authenticated');

  return user;
};
