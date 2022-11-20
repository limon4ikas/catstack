import { PropsWithChildren } from 'react';

import { Layout } from '@catstack/shared/vanilla';
import { useMainLayoutContext } from './main-layout.context';

export const MainLayout = ({ children }: PropsWithChildren) => {
  const { UserProfileContainer } = useMainLayoutContext();

  return <Layout userProfile={<UserProfileContainer />}>{children}</Layout>;
};
