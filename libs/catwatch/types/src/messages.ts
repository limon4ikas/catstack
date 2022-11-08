export type ChatEventMessage = {
  type: 'chat-event';
  id: string;
  createdAt: string;
  text: string;
};

export type ChatMessage = {
  type: 'user-message';
  id: string;
  createdAt: string;
  text: string;
  username: string;
};

export type RoomMessage = ChatMessage | ChatEventMessage;
