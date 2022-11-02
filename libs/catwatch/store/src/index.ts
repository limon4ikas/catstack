/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';

import {
  catWatchApi,
  listenerMiddleware,
} from '@catstack/catwatch/data-access';
import { RtcMiddleware } from '@catstack/shared/rtc';
import { authSlice } from '@catstack/catwatch/features/auth';
import { roomSlice } from '@catstack/catwatch/features/room';

const makeStore = () =>
  configureStore({
    reducer: {
      [catWatchApi.reducerPath]: catWatchApi.reducer,
      [authSlice.name]: authSlice.reducer,
      [roomSlice.name]: roomSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(listenerMiddleware.middleware)
        .concat(catWatchApi.middleware)
        .concat(RtcMiddleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export const wrapper = createWrapper<AppStore>(makeStore);
