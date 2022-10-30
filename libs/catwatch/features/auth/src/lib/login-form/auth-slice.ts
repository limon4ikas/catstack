import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const AUTH_SLICE = 'auth';

export interface AuthSliceState {
  user: null | unknown;
  token: null | string;
}

const initialState: AuthSliceState = {
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: AUTH_SLICE,
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user, token } }: PayloadAction<{ user: any; token: string }>
    ) => {
      state.token = token;
      state.user = user;
    },
  },
});

export const { setCredentials } = authSlice.actions;
