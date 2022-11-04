import { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

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
  VideoCallContainer,
} from '@catstack/catwatch/features/room';
import { useCopyToClipboard } from '@catstack/shared/hooks';

export interface ChatWindowProps {
  roomId: string;
}

const ChatFrame = (props: ChatWindowProps) => {
  const [tab, setTab] = useState('chat');
  const handleTabChange = (value: string) => setTab(value);

  return (
    <Tabs
      defaultValue="chat"
      onValueChange={handleTabChange}
      className="flex flex-col h-full bg-white shadow rounded-xl"
    >
      <TabsList className="flex gap-4 p-4 border-b border-gray-200">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
      </TabsList>
      <TabsContent
        value="chat"
        className={`flex flex-col ${tab === 'chat' ? 'flex-grow' : ''}`}
      >
        <ChatWindowContainer roomId={props.roomId} />
      </TabsContent>
      <TabsContent value="users">
        <div className="flex-grow">
          <UsersListContainer roomId={props.roomId} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export interface MainFrameProps {
  roomId: string;
}

const MainFrame = (props: MainFrameProps) => {
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

  return <VideoCallContainer roomId={props.roomId} file={file} />;
};
export const RoomPage: NextPage = () => {
  const router = useRouter();
  const roomId = router.query?.roomId as string | undefined;

  if (!roomId) return null;

  return (
    <Layout>
      <div className="flex flex-grow h-full">
        <RoomContextProvider roomId={roomId}>
          <div className="flex-grow pt-4 pb-4 pl-4">
            <MainFrame roomId={roomId} />
          </div>
          <div className="p-4 w-96">
            <ChatFrame roomId={roomId} />
          </div>
        </RoomContextProvider>
      </div>
    </Layout>
  );
};

export default withAuth(RoomPage)();
