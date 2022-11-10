import { useSelector } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';

import { UserProfile } from '@catstack/catwatch/types';
import {
  catWatchApi,
  useLazyUserInfoQuery,
  useLoginMutation,
  useLogoutMutation,
} from '@catstack/catwatch/data-access';

import { selectUser } from './auth-slice.selectors';

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
  reducers: {
    logout: () => initialState,
  },
  extraReducers(builder) {
    builder.addMatcher(
      catWatchApi.endpoints.userInfo.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
      }
    );
    builder.addMatcher(catWatchApi.endpoints.logout.matchFulfilled, (state) => {
      state.user = null;
    });
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;

export const useAuthUser = () => {
  const user = useSelector(selectUser);

  if (!user) throw new Error('No user found, are you authenticated?');

  return user;
};

export const useAuth = () => {
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const [getUserInfo] = useLazyUserInfoQuery();

  const logout = async () => {
    await logoutMutation();
  };

  const login = async (username: string, password: string) => {
    try {
      await loginMutation({ username, password });
      await getUserInfo();
    } catch (e) {
      console.error(e);
    }
  };

  return { login, logout };
};
