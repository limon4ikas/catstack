import { NextPage } from 'next';

import { Layout } from '@catstack/shared/vanilla';
import { withAuth } from '@catstack/catwatch/features/auth';

const Index: NextPage = () => {
  return (
    <Layout header="Create">
      <div className="flex flex-wrap items-center gap-4 p-6 bg-white rounded-lg">
        <div>Dashboard</div>
      </div>
    </Layout>
  );
};

export default withAuth(Index)();
