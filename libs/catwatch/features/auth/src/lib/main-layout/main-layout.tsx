import { PropsWithChildren } from 'react';

import { Layout } from '@catstack/shared/vanilla';
import { SocketProvider } from '@catstack/catwatch/data-access';
import { useMainLayoutContext } from './main-layout.context';

export const MainLayout = ({ children }: PropsWithChildren) => {
  const { UserProfileContainer } = useMainLayoutContext();

  return (
    <SocketProvider>
      <Layout userProfile={<UserProfileContainer />}>{children}</Layout>
    </SocketProvider>
  );
};
