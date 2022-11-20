import { NextPage } from 'next';

import { MainLayout, withAuth } from '@catstack/catwatch/features/auth';

import { Providers } from '../../providers';

const ProfilePage: NextPage = () => {
  return (
    <Providers>
      <MainLayout>Profile Page</MainLayout>
    </Providers>
  );
};

export default withAuth(ProfilePage)();
