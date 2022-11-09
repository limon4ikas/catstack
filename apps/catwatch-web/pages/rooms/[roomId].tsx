import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Layout } from '@catstack/shared/vanilla';
import {
  UserProfileContainer,
  withAuth,
} from '@catstack/catwatch/features/auth';
import { RoomScreen } from '@catstack/catwatch/features/room';
import { SocketProvider } from '@catstack/catwatch/data-access';

export const RoomPage: NextPage = () => {
  const router = useRouter();
  const roomId = router.query?.roomId as string | undefined;

  if (!roomId) return null;

  return (
    <SocketProvider>
      <Layout userProfile={<UserProfileContainer />}>
        <RoomScreen roomId={roomId} />
      </Layout>
    </SocketProvider>
  );
};

export default withAuth(RoomPage)();
