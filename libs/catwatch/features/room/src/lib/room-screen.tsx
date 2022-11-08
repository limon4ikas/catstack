import { useState } from 'react';

import { cx } from '@catstack/shared/utils';
import { useCopyToClipboard } from '@catstack/shared/hooks';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from '@catstack/shared/vanilla';

import { ChatWindowContainer } from './chat';
import { RoomContextProvider } from './context';
import { CreateTorrentForm } from './create-torrent-form';
import { UsersListContainer } from './user-list';
import { VideoPlayer } from './video-player';

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

const MainFrame = () => {
  const { copy } = useCopyToClipboard();
  const [file, setFile] = useState<string | null>(null);

  const handleCreatedTorrent = async (
    name: string,
    magnetUri: string,
    file: File
  ) => {
    await copy(magnetUri);
    toast(`Seeding torrent ${name}`);
    toast('Copied magnet uri to clipboard!');
    setFile(URL.createObjectURL(file));
  };

  if (!file) {
    return <CreateTorrentForm onCreatedTorrent={handleCreatedTorrent} />;
  }

  return <VideoPlayer file={file} />;
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
            <MainFrame />
          </div>
          <div className="flex-shrink-0 w-96">
            <ChatFrame roomId={roomId} />
          </div>
        </RoomContextProvider>
      </div>
    </div>
  );
};
