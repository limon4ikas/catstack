import { PropsWithChildren } from 'react';

import { Layout } from '@catstack/shared/vanilla';
import { UserProfileContainer } from '@catstack/catwatch/features/auth';
import { SocketProvider } from '@catstack/catwatch/data-access';

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <SocketProvider>
      <Layout userProfile={<UserProfileContainer />}>{children}</Layout>
    </SocketProvider>
  );
};
