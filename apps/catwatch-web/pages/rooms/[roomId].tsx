import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { withAuth } from '@catstack/catwatch/features/auth';
import { RoomScreen } from '@catstack/catwatch/features/room';
import { SocketProvider } from '@catstack/catwatch/data-access';

import { MainLayout } from '../../components/layout';

export const RoomPage: NextPage = () => {
  const router = useRouter();
  const roomId = router.query?.roomId as string | undefined;

  if (!roomId) return null;

  return (
    <SocketProvider>
      <MainLayout>
        <RoomScreen roomId={roomId} />
      </MainLayout>
    </SocketProvider>
  );
};

export default withAuth(RoomPage)();
