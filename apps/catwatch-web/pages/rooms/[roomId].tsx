import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Layout } from '@catstack/shared/vanilla';
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

  if (!roomId) return null;

  return (
    <Layout>
      <div className="flex flex-grow h-full">
        <div className="flex-grow pt-4 pb-4 pl-4">
          <video controls className="h-full rounded-lg" />
        </div>
        <div className="p-4 w-80">
          <ChatWindowContainer />
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(RoomPage)();
