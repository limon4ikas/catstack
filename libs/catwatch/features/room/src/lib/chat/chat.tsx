import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { useForm } from 'react-hook-form';

import { RoomMessage } from '@catstack/catwatch/types';
import { Input, Button } from '@catstack/shared/vanilla';
import { selectUserId } from '@catstack/catwatch/features/auth';
import { newMessage } from '@catstack/catwatch/actions';

import { getUserById, getAllRoomMessages } from '../room-slice';
import { useGetRoomUsersQuery } from '@catstack/catwatch/data-access';
import { useRoomContext } from '../context';

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
  const { handleSubmit, register, reset } = useForm<{
    message: string;
  }>();

  const onSubmit = (data: { message: string }) => {
    onSendMessage(data.message);
    reset({ message: '' });
  };

  return (
    <form className="flex w-full gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Send message" {...register('message')} />
      <Button type="submit">Send</Button>
    </form>
  );
};

export interface ChatWindowProps {
  messages: RoomMessage[];
}

const ChatWindow = ({ messages }: ChatWindowProps) => {
  return (
    <ul className="flex flex-col pt-3">
      {messages.map((message, idx) => (
        <li key={idx} className="px-3" style={{ overflowWrap: 'anywhere' }}>
          <div className="px-4 py-1 transition-colors rounded-md hover:bg-gray-100">
            <span
              style={{ color: stringToColour(message.username) }}
              className="text-sm font-semibold leading-5"
            >
              {message.username}:{' '}
            </span>
            <span className="text-sm leading-5">{message.text}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export interface ChatWindowContainerProps {
  roomId: string;
}

export const ChatWindowContainer = (props: ChatWindowContainerProps) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const currentUser = useSelector(getUserById(userId));
  const messages = useSelector(getAllRoomMessages);
  const { send } = useRoomContext();
  const chatRef = useRef<HTMLDivElement>(null);
  useGetRoomUsersQuery(props.roomId);

  const handleSendMessage = (text: string) => {
    if (!currentUser) return;
    if (!text) return;

    const message: RoomMessage = {
      id: nanoid(),
      text,
      timestamp: new Date().toISOString(),
      username: currentUser.username,
    };

    send(newMessage(message));
    dispatch(newMessage(message));
  };

  useEffect(() => {
    const chatEl = chatRef.current;
    const height = chatEl?.scrollHeight;

    chatEl?.scrollTo({ top: height, behavior: 'smooth' });
  }, [messages.length]);

  return (
    <>
      <div className="flex-grow overflow-auto" ref={chatRef}>
        <ChatWindow messages={messages} />
      </div>
      <div className="p-4 border-t border-t-gray-200">
        <SendMessageForm onSendMessage={handleSendMessage} />
      </div>
    </>
  );
};
