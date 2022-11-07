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
  Connection,
  connectionsAdapter,
  ConnectionState,
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
      connectionsAdapter.removeOne(state.connections, action.payload.id);
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

export const getRoomConnection = createSelector(
  getRoomState,
  (state) => state.connections
);

export const getRoomPlayerState = createSelector(
  getRoomState,
  (state) => state.playerState
);

const roomUsersSelectors = userAdapter.getSelectors(getRoomParticipants);
const roomMessagesSelectors = messagesAdapter.getSelectors(getRoomMessages);
const roomConnectionsSelectors =
  connectionsAdapter.getSelectors(getRoomConnection);

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

// Player state
export const getLastSeek = createSelector(
  getRoomPlayerState,
  (state) => state.lastSeek
);

export const getVideoState = createSelector(
  getRoomPlayerState,
  (state) => state.videoState
);

export const getEventFrom = createSelector(
  getRoomPlayerState,
  (state) => state.eventFrom
);

export const getVideoPlayerState = createSelector(
  getLastSeek,
  getVideoState,
  getEventFrom,
  (seek, videoState, eventFrom) => ({ seek, videoState, eventFrom })
);

// Connections
export const getAllConnections = roomConnectionsSelectors.selectAll;
export const getRoomConnections = roomConnectionsSelectors.selectEntities;
export const getRoomConnectionIds = roomConnectionsSelectors.selectIds;
export const getTotalConnections = roomConnectionsSelectors.selectTotal;
export const getConnectionById = (id: EntityId) => {
  return createSelector(
    (state: AppStateWithRoom) => state,
    (state) => roomUsersSelectors.selectById(state, id)
  );
};

export const getUsersWithConnections = (userId: EntityId) => {
  return createSelector(getRoomConnection, getAllUsers, (connection, users) =>
    users
      .filter((user) => user.id !== userId)
      .map((user) => ({
        ...user,
        isConnected:
          connectionsAdapter.getSelectors().selectById(connection, user.id)
            ?.state === 'connected',
      }))
  );
};
