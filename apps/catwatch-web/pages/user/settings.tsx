import { NextPage } from 'next';

import { withAuth } from '@catstack/catwatch/features/auth';

import { MainLayout } from '../../components/layout';

const SettingsPage: NextPage = () => {
  return <MainLayout>Settings Page</MainLayout>;
};

export default withAuth(SettingsPage)();
