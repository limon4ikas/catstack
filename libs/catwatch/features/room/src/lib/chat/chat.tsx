import { useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { RoomMessage } from '@catstack/catwatch/types';
import { Input, Button } from '@catstack/shared/vanilla';
import { selectUserId } from '@catstack/catwatch/features/auth';
import { messageAdded } from '@catstack/catwatch/actions';

import { getUserById, getAllRoomMessages } from '../room-slice';

const stringToColour = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
};

export interface SendMessageFormProps {
  onSendMessage: (message: string) => void;
}

const SendMessageForm = ({ onSendMessage }: SendMessageFormProps) => {
  const [message, setMessage] = useState('');

  return (
    <div className="flex w-full gap-4">
      <Input
        label="Send message"
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={() => onSendMessage(message)}>Send</Button>
    </div>
  );
};

export interface ChatWindowProps {
  messages: RoomMessage[];
}

const ChatWindow = ({ messages }: ChatWindowProps) => {
  return (
    <ul className="flex flex-col flex-grow gap-4">
      {messages.map((message, idx) => (
        <li key={idx} style={{ color: stringToColour(message.username) }}>
          {message.username}: {message.text}
        </li>
      ))}
    </ul>
  );
};

export const ChatWindowContainer = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const currentUser = useSelector(getUserById(userId));
  const messages = useSelector(getAllRoomMessages);

  const handleSendMessage = (text: string) => {
    if (!currentUser) return;

    const message: RoomMessage = {
      id: nanoid(),
      text,
      timestamp: new Date().toISOString(),
      username: currentUser.username,
    };

    dispatch(messageAdded(message));
  };

  return (
    <>
      <ChatWindow messages={messages} />
      <div className="p-4 mt-8">
        <SendMessageForm onSendMessage={handleSendMessage} />
      </div>
    </>
  );
};
