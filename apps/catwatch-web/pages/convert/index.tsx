import { NextPage } from 'next';

import { withAuth } from '@catstack/catwatch/features/auth';

import { MainLayout } from '../../components/layout';

const ConvertPage: NextPage = () => {
  return <MainLayout>ConvertPage</MainLayout>;
};

export default withAuth(ConvertPage)();
