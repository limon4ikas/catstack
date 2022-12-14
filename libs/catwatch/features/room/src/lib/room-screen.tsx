import { ReactNode, useState } from 'react';

import { cx } from '@catstack/shared/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@catstack/shared/vanilla';

import { ChatWindowContainer } from './chat';
import { RoomContextProvider } from './context';
import { UsersListContainer } from './user-list';
import { SharedVideoContainer } from './shared-video';

export interface ChatFrameProps {
  chat: ReactNode;
  usersList: ReactNode;
}

const ChatFrame = ({ chat, usersList }: ChatFrameProps) => {
  const [tab, setTab] = useState('chat');

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      className="flex flex-col flex-grow"
    >
      <TabsList className="flex border-b border-gray-200 dark:border-b-gray-700">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
      </TabsList>
      <TabsContent
        value="chat"
        className={cx(
          tab === 'chat'
            ? 'flex-grow flex flex-col h-[calc(100%-45px)]'
            : 'hidden'
        )}
      >
        {chat}
      </TabsContent>
      <TabsContent
        value="users"
        className={cx(tab === 'users' ? '' : 'hidden')}
      >
        {usersList}
      </TabsContent>
    </Tabs>
  );
};

export interface RoomScreenProps {
  roomId: string;
}

export const RoomScreen = ({ roomId }: RoomScreenProps) => {
  return (
    <RoomContextProvider roomId={roomId}>
      <div className="flex-grow">
        <SharedVideoContainer />
      </div>
      <div className="flex flex-shrink-0 bg-white shadow w-96 dark:bg-gray-800">
        <ChatFrame
          chat={<ChatWindowContainer roomId={roomId} />}
          usersList={<UsersListContainer roomId={roomId} />}
        />
      </div>
    </RoomContextProvider>
  );
};
