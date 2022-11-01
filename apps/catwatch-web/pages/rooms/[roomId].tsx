import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Layout } from '@catstack/shared/vanilla';
import { withAuth } from '@catstack/catwatch/features/auth';
import { UsersListContainer } from '@catstack/catwatch/features/room';

export const RoomPage: NextPage = () => {
  const router = useRouter();
  const roomId = router.query?.roomId as string | undefined;

  if (!roomId) return null;

  return (
    <Layout header={`Room ${roomId}`}>
      <UsersListContainer roomId={roomId} />
    </Layout>
  );
};

export default withAuth(RoomPage)();
