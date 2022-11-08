import { useState } from 'react';

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
  roomId: string;
}

const ChatFrame = (props: ChatFrameProps) => {
  const [tab, setTab] = useState('chat');

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      className="flex flex-col h-full overflow-hidden bg-white shadow dark:bg-gray-800"
    >
      <TabsList className="flex border-b border-gray-200 dark:border-b-gray-700">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
      </TabsList>
      <TabsContent
        value="chat"
        className={cx(
          tab !== 'chat' ? 'hidden' : '',
          'h-[calc(100%-42px)] flex flex-col'
        )}
      >
        <ChatWindowContainer roomId={props.roomId} />
      </TabsContent>
      <TabsContent
        value="users"
        className={cx(tab !== 'users' ? 'hidden' : '')}
      >
        <UsersListContainer roomId={props.roomId} />
      </TabsContent>
    </Tabs>
  );
};

export interface RoomScreenProps {
  roomId: string;
}

export const RoomScreen = ({ roomId }: RoomScreenProps) => {
  return (
    <div className="h-full pt-[64px]">
      <div className="flex h-full">
        <RoomContextProvider roomId={roomId}>
          <div className="flex-grow p-4">
            <SharedVideoContainer />
          </div>
          <div className="flex-shrink-0 w-96">
            <ChatFrame roomId={roomId} />
          </div>
        </RoomContextProvider>
      </div>
    </div>
  );
};
