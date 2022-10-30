import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';

import { authSlice, AUTH_SLICE } from '@catstack/catwatch/features/auth';

import { catWatchApi } from './catwatch-api';

const makeStore = () =>
  configureStore({
    reducer: {
      [catWatchApi.reducerPath]: catWatchApi.reducer,
      [AUTH_SLICE]: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(catWatchApi.middleware),
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
export const useAppSelector: TypedUseSelectorHook<AppStore> = useSelector;

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });
