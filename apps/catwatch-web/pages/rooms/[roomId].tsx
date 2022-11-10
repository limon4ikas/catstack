import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { withAuth } from '@catstack/catwatch/features/auth';
import { RoomScreen } from '@catstack/catwatch/features/room';

import { MainLayout } from '../../components/layout';

export const RoomPage: NextPage = () => {
  const router = useRouter();
  const roomId = router.query?.roomId as string | undefined;

  if (!roomId) return null;

  return (
    <MainLayout>
      <RoomScreen roomId={roomId} />
    </MainLayout>
  );
};

export default withAuth(RoomPage)();
