import { createSlice } from '@reduxjs/toolkit';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AppState } from '@catstack/catwatch/store';
import { userJoined, userLeft } from '@catstack/catwatch/actions';
import { UserProfile } from '@catstack/catwatch/types';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { catWatchApi } from '@catstack/catwatch/data-access';

export interface RoomSliceState {
  lastJoinedUser: UserProfile | null;
  participants: Record<number, UserProfile>;
}

const initialState: RoomSliceState = {
  lastJoinedUser: null,
  participants: {},
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(userJoined.match, (state, action) => {
      const user = action.payload;
      state.lastJoinedUser = user;
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

export const selectLastJoinedUser = (state: AppState) => {
  return state.room.lastJoinedUser;
};
