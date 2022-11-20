import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { RoomMessage } from '@catstack/catwatch/types';
import { useGetRoomUsersQuery } from '@catstack/catwatch/data-access';
import { newUserMessage } from '@catstack/catwatch/actions';
import { Input, Button } from '@catstack/shared/vanilla';
import { useAuthUser } from '@catstack/catwatch/features/auth';

import { useRoomContext } from '../context';
import { getAllRoomMessages } from '../room-slice.selectors';

const stringToColour = (string: string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
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

export interface ChatMessageProps {
  username: string;
  text: string;
}

export const ChatMessage = ({ username, text }: ChatMessageProps) => {
  return (
    <div className="px-4 py-1 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
      <span
        style={{ color: stringToColour(username) }}
        className="text-sm font-semibold leading-5"
      >
        {username}:{' '}
      </span>
      <span className="text-sm leading-5 dark:text-white">{text}</span>
    </div>
  );
};

export interface ChatEventMessageProps {
  text: string;
}

export const ChatEventMessage = ({ text }: ChatEventMessageProps) => {
  return (
    <span className="block py-1 text-sm font-semibold leading-5 text-center transition-colors rounded-md text-slate-400 hover:bg-gray-100 dark:hover:bg-gray-700">
      {text}
    </span>
  );
};

export interface ChatWindowProps {
  messages: RoomMessage[];
}

const ChatWindow = ({ messages }: ChatWindowProps) => {
  const [parent] = useAutoAnimate<HTMLUListElement>({ duration: 150 });

  useEffect(() => {
    const chatEl = parent.current;
    const height = chatEl?.scrollHeight;

    if (!height || !chatEl) return;

    chatEl.scrollTo({ top: height, behavior: 'smooth' });
  }, [messages.length, parent]);

  return (
    <ul
      className="flex flex-col flex-grow min-h-0 overflow-x-hidden overflow-y-auto"
      ref={parent}
    >
      {messages.map((message, idx) => {
        return (
          <li key={idx} className="px-3" style={{ overflowWrap: 'anywhere' }}>
            {message.type === 'chat-event' ? (
              <ChatEventMessage text={message.text} />
            ) : (
              <ChatMessage username={message.username} text={message.text} />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export interface ChatWindowContainerProps {
  roomId: string;
}

export const ChatWindowContainer = (props: ChatWindowContainerProps) => {
  const { username } = useAuthUser();
  const messages = useSelector(getAllRoomMessages);
  const { dispatchSharedEvent } = useRoomContext();
  useGetRoomUsersQuery(props.roomId);

  const handleSendMessage = (text: string) => {
    if (!text) return;

    dispatchSharedEvent(newUserMessage({ username, text }));
  };

  return (
    <>
      <ChatWindow messages={messages} />
      <div className="p-4 bg-white border-t dark:bg-gray-800 border-t-gray-200 dark:border-t-gray-700">
        <SendMessageForm onSendMessage={handleSendMessage} />
      </div>
    </>
  );
};
