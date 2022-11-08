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
        type: 'user-message',
        id: nanoid(),
        text: message.text,
        username: message.username,
        createdAt: new Date().toISOString(),
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
        type: 'chat-event',
        createdAt: new Date().toISOString(),
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
