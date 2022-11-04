import { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import {
  Layout,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@catstack/shared/vanilla';
import { withAuth } from '@catstack/catwatch/features/auth';
import {
  ChatWindowContainer,
  TorrentManagerContainer,
  UsersListContainer,
  VideoCallContainer,
} from '@catstack/catwatch/features/room';

export const RoomPage: NextPage = () => {
  const router = useRouter();
  const roomId = router.query?.roomId as string | undefined;

  const [tab, setTab] = useState('chat');
  const handleTabChange = (value: string) => setTab(value);

  if (!roomId) return null;

  return (
    <Layout>
      <div className="flex flex-grow h-full">
        <div className="flex-grow pt-4 pb-4 pl-4">
          <VideoCallContainer roomId={roomId} />
        </div>
        <div className="p-4 w-80">
          <Tabs
            defaultValue="chat"
            onValueChange={handleTabChange}
            className="flex flex-col h-full bg-white rounded-xl"
          >
            <TabsList className="flex gap-4 p-4 border-b border-gray-200">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            <TabsContent
              value="chat"
              className={`flex flex-col ${tab === 'chat' ? 'flex-grow' : ''}`}
            >
              <ChatWindowContainer />
            </TabsContent>
            <TabsContent value="users">
              <div className="flex-grow">
                <UsersListContainer roomId={roomId} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(RoomPage)();
