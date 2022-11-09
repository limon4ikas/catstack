import { PropsWithChildren } from 'react';

import { Layout } from '@catstack/shared/vanilla';
import { UserProfileContainer } from '@catstack/catwatch/features/auth';

export const MainLayout = (props: PropsWithChildren) => {
  return (
    <Layout userProfile={<UserProfileContainer />}>{props.children}</Layout>
  );
};
