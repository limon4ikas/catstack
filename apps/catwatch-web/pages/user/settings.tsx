import { NextPage } from 'next';

import { MainLayout, withAuth } from '@catstack/catwatch/features/auth';

import { Providers } from '../../providers';

const SettingsPage: NextPage = () => {
  return (
    <Providers>
      <MainLayout>Settings Page</MainLayout>;
    </Providers>
  );
};

export default withAuth(SettingsPage)();
