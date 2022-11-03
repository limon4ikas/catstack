import { createSelector, createSlice } from '@reduxjs/toolkit';

import { UserProfile } from '@catstack/catwatch/types';
import { catWatchApi } from '@catstack/catwatch/data-access';
import { userJoined, userLeft } from '@catstack/catwatch/actions';

export const ROOM_SLICE_NAME = 'room';

export interface RoomSliceState {
  participants: Record<number, UserProfile>;
}

const initialState: RoomSliceState = {
  participants: {},
};

export const roomSlice = createSlice({
  name: ROOM_SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(userJoined.match, (state, action) => {
      const user = action.payload;
      state.participants[action.payload.id] = user;
    });
    builder.addMatcher(userLeft.match, (state, action) => {
      const userId = action.payload.id;
      delete state.participants[userId];
    });
    builder.addMatcher(
      catWatchApi.endpoints.getRoomUsers.matchFulfilled,
      (state, action) => {
        Object.values(action.payload.entities)
          .filter((user): user is UserProfile => !!user)
          .forEach((user) => (state.participants[user.id] = user));
      }
    );
  },
});

export const roomActions = roomSlice.actions;
export const roomReducer = roomSlice.reducer;

export const getRoomState = (state: { [ROOM_SLICE_NAME]: RoomSliceState }) =>
  state[ROOM_SLICE_NAME];

export const getRoomParticipants = createSelector(
  getRoomState,
  (state) => state.participants
);

export const getParticipant = createSelector(
  getRoomParticipants,
  (id: number) => id,
  (state, id) => state[id]
);
