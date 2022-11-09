import { NextPage } from 'next';

import { withAuth } from '@catstack/catwatch/features/auth';

import { MainLayout } from '../../components/layout';

const ProfilePage: NextPage = () => {
  return <MainLayout>Profile Page</MainLayout>;
};

export default withAuth(ProfilePage)();
