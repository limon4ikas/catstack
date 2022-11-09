import { NextPage } from 'next';

import { withAuth } from '@catstack/catwatch/features/auth';
import { StartScreen } from '@catstack/catwatch/features/start';

import { MainLayout } from '../components/layout';

const Index: NextPage = () => {
  return (
    <MainLayout>
      <StartScreen />
    </MainLayout>
  );
};

export default withAuth(Index)();
