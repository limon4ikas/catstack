import { useSelector } from 'react-redux';

import { newUserMessage } from '@catstack/catwatch/actions';
import { useGetRoomUsersQuery } from '@catstack/catwatch/data-access';
import { useAuthUser } from '@catstack/catwatch/features/auth';

import { useRoomContext } from '../context';
import { getAllRoomMessages } from '../room-slice.selectors';
import { ChatWindowContainerProps, Chat } from './chat';

export const ChatWindowContainer = (props: ChatWindowContainerProps) => {
  const { username } = useAuthUser();
  const messages = useSelector(getAllRoomMessages);
  const { dispatchSharedEvent } = useRoomContext();
  useGetRoomUsersQuery(props.roomId);

  const handleSendMessage = (text: string) => {
    if (!text) return;

    dispatchSharedEvent(newUserMessage({ username, text }));
  };

  return <Chat messages={messages} onSendMessage={handleSendMessage} />;
};
