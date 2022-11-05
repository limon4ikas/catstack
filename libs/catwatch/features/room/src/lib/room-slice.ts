import {
  createSelector,
  createSlice,
  EntityId,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';

import { RoomMessage, UserProfile } from '@catstack/catwatch/types';
import { catWatchApi } from '@catstack/catwatch/data-access';
import {
  newMessage,
  messagesAdapter,
  userAdapter,
  userJoined,
  userLeft,
} from '@catstack/catwatch/actions';

/**
|--------------------------------------------------
| TYPES
|--------------------------------------------------
*/

export const ROOM_SLICE_NAME = 'room' as const;

export type VideoState = 'play' | 'pause';

export interface AppStateWithRoom {
  [ROOM_SLICE_NAME]: RoomSliceState;
}

export interface RoomSliceState {
  participants: EntityState<UserProfile>;
  messages: EntityState<RoomMessage>;
  //
  videoState: VideoState;
  lastSeek: number | null;
}

const initialState: RoomSliceState = {
  participants: userAdapter.getInitialState(),
  messages: messagesAdapter.getInitialState(),
  //
  videoState: 'pause',
  lastSeek: null,
};

/**
|--------------------------------------------------
| SLICE
|--------------------------------------------------
*/

export const roomSlice = createSlice({
  name: ROOM_SLICE_NAME,
  initialState,
  reducers: {
    play: (state, action: PayloadAction<number>) => {
      state.videoState = 'play';
      state.lastSeek = action.payload;
    },
    pause: (state, action: PayloadAction<number>) => {
      state.videoState = 'pause';
      state.lastSeek = action.payload;
    },
    seek: (state, action: PayloadAction<number>) => {
      state.lastSeek = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(newMessage, (state, action) => {
      messagesAdapter.addOne(state.messages, action.payload);
    });
    builder.addMatcher(
      catWatchApi.endpoints.getRoomUsers.matchFulfilled,
      (state, action) => {
        state.participants = action.payload;
      }
    );
    builder.addMatcher(userJoined.match, (state, action) => {
      userAdapter.addOne(state.participants, action.payload);
    });
    builder.addMatcher(userLeft.match, (state, action) => {
      userAdapter.removeOne(state.participants, action.payload.id);
    });
  },
});

export const roomActions = roomSlice.actions;
export const roomReducer = roomSlice.reducer;

/**
|--------------------------------------------------
| SELECTORS
|--------------------------------------------------
*/

// General
export const getRoomState = (state: AppStateWithRoom) => {
  return state[ROOM_SLICE_NAME];
};

export const getRoomParticipants = createSelector(
  getRoomState,
  (state) => state.participants
);

export const getRoomMessages = createSelector(
  getRoomState,
  (state) => state.messages
);

const roomUsersSelectors = userAdapter.getSelectors(getRoomParticipants);
const roomMessagesSelectors = messagesAdapter.getSelectors(getRoomMessages);

// Room
export const getAllUsers = roomUsersSelectors.selectAll;
export const getRoomUsers = roomUsersSelectors.selectEntities;
export const getRoomUserIds = roomUsersSelectors.selectIds;
export const getTotalUsers = roomUsersSelectors.selectTotal;

export const getUserById = (id: EntityId) => {
  return createSelector(
    (state: AppStateWithRoom) => state,
    (state) => roomUsersSelectors.selectById(state, id)
  );
};

// Messages
export const getAllRoomMessages = roomMessagesSelectors.selectAll;
export const getRoomMessageById = roomMessagesSelectors.selectById;
export const getMessages = roomMessagesSelectors.selectEntities;
export const getMessagesIds = roomMessagesSelectors.selectIds;
export const getTotalMessages = roomMessagesSelectors.selectTotal;

export const getMessageById = (id: EntityId) => {
  return createSelector(
    (state: AppStateWithRoom) => state,
    (state) => getRoomMessageById(state, id)
  );
};

export const getLastSeek = createSelector(
  getRoomState,
  (state) => state.lastSeek
);
export const getVideoState = createSelector(
  getRoomState,
  (state) => state.videoState
);

export const getVideoPlayerState = createSelector(
  getLastSeek,
  getVideoState,
  (seek, videoState) => ({ seek, videoState })
);
