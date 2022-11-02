import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Layout } from '@catstack/shared/vanilla';
import { withAuth } from '@catstack/catwatch/features/auth';
import {
  TorrentManagerContainer,
  UsersListContainer,
  VideoCallContainer,
} from '@catstack/catwatch/features/room';

export const RoomPage: NextPage = () => {
  const router = useRouter();
  const roomId = router.query?.roomId as string | undefined;

  if (!roomId) return null;

  return (
    <Layout header={`Room ${roomId}`}>
      <div className="flex gap-8">
        <div className="flex-1 p-6 bg-white rounded-lg">
          <UsersListContainer roomId={roomId} />
        </div>
        <div className="flex-1 p-6 bg-white rounded-lg">
          <TorrentManagerContainer />
        </div>
      </div>
      <div className="mt-8">
        <VideoCallContainer />
      </div>
    </Layout>
  );
};

export default withAuth(RoomPage)();
