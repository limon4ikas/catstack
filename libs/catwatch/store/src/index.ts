import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';

import {
  CATWATCH_API_NAME,
  catWatchApiReducer,
  catWatchApiMiddleware,
} from '@catstack/catwatch/data-access';
import { AUTH_SLICE_NAME, authReducer } from '@catstack/catwatch/features/auth';
import { ROOM_SLICE_NAME, roomReducer } from '@catstack/catwatch/features/room';

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

const makeStore = () =>
  configureStore({
    reducer: {
      [CATWATCH_API_NAME]: catWatchApiReducer,
      [AUTH_SLICE_NAME]: authReducer,
      [ROOM_SLICE_NAME]: roomReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(catWatchApiMiddleware),
  });

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export const wrapper = createWrapper<AppStore>(makeStore);
