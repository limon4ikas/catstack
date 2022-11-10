import { PropsWithChildren } from 'react';

import { Layout } from '@catstack/shared/vanilla';
import { UserProfileContainer } from '@catstack/catwatch/features/auth';
import { SocketProvider } from '@catstack/catwatch/data-access';

export const MainLayout = (props: PropsWithChildren) => {
  return (
    <SocketProvider>
      <Layout userProfile={<UserProfileContainer />}>{props.children}</Layout>
    </SocketProvider>
  );
};
