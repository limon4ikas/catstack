import { createSelector, EntityId } from '@reduxjs/toolkit';

import {
  userAdapter,
  messagesAdapter,
  connectionsAdapter,
} from '@catstack/catwatch/actions';

import { AppStateWithRoom, ROOM_SLICE_NAME } from './room-slice';

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
