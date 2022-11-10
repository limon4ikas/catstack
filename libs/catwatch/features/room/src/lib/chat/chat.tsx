import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { RoomMessage } from '@catstack/catwatch/types';
import { useGetRoomUsersQuery } from '@catstack/catwatch/data-access';
import { newUserMessage } from '@catstack/catwatch/actions';
import { Input, Button } from '@catstack/shared/vanilla';
import { useAuthUser } from '@catstack/catwatch/features/auth';

import { useRoomContext } from '../context';
import { getAllRoomMessages } from '../room-slice.selectors';

const stringToColour = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
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
      <Input
        label="Send message"
        autoComplete="off"
        placeholder="Message"
        {...register('message')}
      />
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
          {message.type === 'chat-event' ? (
            <span className="block py-1 text-sm font-semibold leading-5 text-center transition-colors rounded-md text-slate-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              {message.text}
            </span>
          ) : (
            <div className="px-4 py-1 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
              <span
                style={{ color: stringToColour(message.username) }}
                className="text-sm font-semibold leading-5"
              >
                {message.username}:{' '}
              </span>
              <span className="text-sm leading-5 dark:text-white">
                {message.text}
              </span>
            </div>
          )}
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
  const { username } = useAuthUser();
  const messages = useSelector(getAllRoomMessages);
  const { send } = useRoomContext();
  const chatRef = useRef<HTMLDivElement>(null);
  useGetRoomUsersQuery(props.roomId);

  const handleSendMessage = (text: string) => {
    if (!text) return;
    const messageAction = newUserMessage({ text, username });

    send(messageAction);
    dispatch(messageAction);
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
      <div className="p-4 border-t border-t-gray-200 dark:border-t-gray-700">
        <SendMessageForm onSendMessage={handleSendMessage} />
      </div>
    </>
  );
};
