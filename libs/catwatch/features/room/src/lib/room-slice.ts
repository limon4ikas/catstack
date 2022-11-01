import { createSlice } from '@reduxjs/toolkit';

import { userJoined } from '@catstack/catwatch/actions';
import { UserProfile } from '@catstack/catwatch/types';

export interface RoomSliceState {
  lastJoinedUser: UserProfile | null;
}

const initialState: RoomSliceState = {
  lastJoinedUser: null,
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(userJoined.match, (state, action) => {
      state.lastJoinedUser = action.payload;
    });
  },
});
