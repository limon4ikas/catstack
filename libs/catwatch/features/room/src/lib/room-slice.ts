import {
  createSlice,
  EntityId,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';

import { RoomMessage, UserProfile } from '@catstack/catwatch/types';
import { catWatchApi } from '@catstack/catwatch/data-access';
import {
  newUserMessage,
  messagesAdapter,
  userAdapter,
  userJoined,
  userLeft,
  Connection,
  connectionsAdapter,
  ConnectionState,
  newRoomEventMessage,
} from '@catstack/catwatch/actions';

/**
|--------------------------------------------------
| TYPES
|--------------------------------------------------
*/

export const ROOM_SLICE_NAME = 'room' as const;

export type VideoState = 'play' | 'pause' | null;
export type VideoPlayerActionPayload = { time: number; eventFrom: string };

export interface AppStateWithRoom {
  [ROOM_SLICE_NAME]: RoomSliceState;
}

export interface RoomSliceState {
  participants: EntityState<UserProfile>;
  messages: EntityState<RoomMessage>;
  connections: EntityState<Connection>;
  playerState: {
    videoState: VideoState;
    lastSeek: number | null;
    eventFrom: string | null;
  };
}

const initialState: RoomSliceState = {
  participants: userAdapter.getInitialState(),
  messages: messagesAdapter.getInitialState(),
  connections: connectionsAdapter.getInitialState(),
  playerState: { videoState: null, lastSeek: null, eventFrom: null },
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
    play: (state, action: PayloadAction<VideoPlayerActionPayload>) => {
      state.playerState.videoState = 'play';
      state.playerState.lastSeek = action.payload.time;
      state.playerState.eventFrom = action.payload.eventFrom;
    },
    pause: (state, action: PayloadAction<VideoPlayerActionPayload>) => {
      state.playerState.videoState = 'pause';
      state.playerState.lastSeek = action.payload.time;
      state.playerState.eventFrom = action.payload.eventFrom;
    },
    seek: (state, action: PayloadAction<VideoPlayerActionPayload>) => {
      state.playerState.lastSeek = action.payload.time;
      state.playerState.eventFrom = action.payload.eventFrom;
    },
    updateConnectionStatus: (
      state,
      action: PayloadAction<{ userId: EntityId; state: ConnectionState }>
    ) => {
      connectionsAdapter.upsertOne(state.connections, {
        userId: action.payload.userId,
        state: action.payload.state,
      });
    },
  },
  extraReducers(builder) {
    builder.addCase(newUserMessage, (state, action) => {
      messagesAdapter.addOne(state.messages, action.payload);
    });
    builder.addCase(newRoomEventMessage, (state, action) => {
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
      connectionsAdapter.removeOne(state.connections, action.payload.id);
    });
  },
});

export const roomActions = roomSlice.actions;
export const roomReducer = roomSlice.reducer;
