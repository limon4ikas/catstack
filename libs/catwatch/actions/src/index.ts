import {
  createEntityAdapter,
  createAction,
  EntityId,
  nanoid,
} from '@reduxjs/toolkit';

import {
  UserProfile,
  RoomMessage,
  ChatMessage,
} from '@catstack/catwatch/types';

/**
|--------------------------------------------------
| USERS
|--------------------------------------------------
*/

export const userAdapter = createEntityAdapter<UserProfile>();
export const userJoined = createAction<UserProfile>('room/userJoined');
export const userLeft = createAction<UserProfile>('room/userLeft');

/**
|--------------------------------------------------
| CHAT
|--------------------------------------------------
*/

export type ChatMessagePayload = Pick<ChatMessage, 'text' | 'username'>;

export type ChatMessageActionCreator = (message: ChatMessagePayload) => {
  payload: RoomMessage;
};

export type ChatEventMessageActionCreator = (message: string) => {
  payload: RoomMessage;
};

export const messagesAdapter = createEntityAdapter<RoomMessage>();

export const newUserMessage = createAction<ChatMessageActionCreator>(
  'room/newMessage',
  (message) => {
    return {
      payload: {
        id: nanoid(),
        createdAt: new Date().toISOString(),
        type: 'user-message',
        text: message.text,
        username: message.username,
      },
    };
  }
);

export const newRoomEventMessage = createAction<ChatEventMessageActionCreator>(
  'room/newEventMessage',
  (message) => {
    return {
      payload: {
        id: nanoid(),
        createdAt: new Date().toISOString(),
        type: 'chat-event',
        text: message,
      },
    };
  }
);

/**
|--------------------------------------------------
| CONNECTION
|--------------------------------------------------
*/

export type ConnectionState = 'connected' | 'not-connected';

export interface Connection {
  userId: EntityId;
  state: ConnectionState;
}

export const connectionsAdapter = createEntityAdapter<Connection>({
  selectId: (model) => model.userId,
});

/**
|--------------------------------------------------
| SUGGESTION TO DOWNLOAD FILE
|--------------------------------------------------
*/

/** New torrent magner URI available */
export const newTorrentFile = createAction<{
  magnetUri: string;
  user: UserProfile;
}>('room/newFile');
