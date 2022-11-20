import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { withAuth, MainLayout } from '@catstack/catwatch/features/auth';
import { RoomScreen } from '@catstack/catwatch/features/room';
import { Providers } from '../../providers';

export const RoomPage: NextPage = () => {
  const router = useRouter();
  const roomId = router.query?.roomId as string;

  return (
    <Providers>
      <MainLayout>
        <RoomScreen roomId={roomId} />
      </MainLayout>
    </Providers>
  );
};

export default withAuth(RoomPage)();
