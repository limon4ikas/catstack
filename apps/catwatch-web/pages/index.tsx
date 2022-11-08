import { NextPage } from 'next';

import { withAuth } from '@catstack/catwatch/features/auth';
import { Layout } from '@catstack/shared/vanilla';
import { StartScreen } from '@catstack/catwatch/features/start';

const Index: NextPage = () => {
  return (
    <Layout>
      <StartScreen />
    </Layout>
  );
};

export default withAuth(Index)();
