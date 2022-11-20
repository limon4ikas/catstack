import { NextPage } from 'next';
import { useRouter } from 'next/router';

import {
  withAuth,
  MainLayout,
  MainLayoutProvider,
  UserProfileContainer,
  IMainLayoutContext,
} from '@catstack/catwatch/features/auth';
import { RoomScreen } from '@catstack/catwatch/features/room';

const context: IMainLayoutContext = {
  UserProfileContainer,
};

export const RoomPage: NextPage = () => {
  const router = useRouter();
  const roomId = router.query?.roomId as string;

  return (
    <MainLayoutProvider value={context}>
      <MainLayout>
        <RoomScreen roomId={roomId} />
      </MainLayout>
    </MainLayoutProvider>
  );
};

export default withAuth(RoomPage)();
