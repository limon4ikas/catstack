import { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { cx } from '@catstack/shared/utils';
import { useCopyToClipboard } from '@catstack/shared/hooks';
import {
  Layout,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from '@catstack/shared/vanilla';
import { withAuth } from '@catstack/catwatch/features/auth';
import {
  ChatWindowContainer,
  CreateTorrentForm,
  RoomContextProvider,
  UsersListContainer,
  VideoPlayer,
} from '@catstack/catwatch/features/room';

export interface ChatWindowProps {
  roomId: string;
}

const ChatFrame = (props: ChatWindowProps) => {
  const [tab, setTab] = useState('chat');

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      className="flex flex-col h-full overflow-hidden bg-white shadow rounded-xl dark:bg-gray-800"
    >
      <TabsList className="flex gap-4 p-4 border-b border-gray-200 dark:border-b-gray-700">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
      </TabsList>
      <TabsContent
        value="chat"
        className={cx(
          tab !== 'chat' && 'hidden',
          'h-[calc(100%-70px)] flex flex-col'
        )}
      >
        <ChatWindowContainer roomId={props.roomId} />
      </TabsContent>
      <TabsContent value="users" className={cx(tab !== 'users' && 'hidden')}>
        <UsersListContainer roomId={props.roomId} />
      </TabsContent>
    </Tabs>
  );
};

const MainFrame = () => {
  const { copy } = useCopyToClipboard();
  const [file, setFile] = useState<string>(null);

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

export const RoomPage: NextPage = () => {
  const router = useRouter();
  const roomId = router.query?.roomId as string | undefined;

  if (!roomId) return null;

  return (
    <Layout>
      <div className="h-full pt-[64px]">
        <div className="flex h-full gap-4 p-4">
          <RoomContextProvider roomId={roomId}>
            <div className="flex-grow">
              <MainFrame />
            </div>
            <div className="flex-shrink-0 w-96">
              <ChatFrame roomId={roomId} />
            </div>
          </RoomContextProvider>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(RoomPage)();
