import { ReactNode } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { useUserInfoQuery } from '@catstack/catwatch/data-access';

import { selectUser } from './auth-slice.selectors';

export interface WithAuthConfig {
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

export const withAuth = (Component: NextPage) => (config?: WithAuthConfig) => {
  const AuthenticatedComponent = () => {
    const router = useRouter();
    const user = useSelector(selectUser);
    const { isError, isFetching } = useUserInfoQuery();

    if (isFetching) return config?.loadingComponent || null;

    if (isError || !user) {
      if (typeof window !== 'undefined') router.push('/auth/login');
      return null;
    }

    return <Component />;
  };

  return AuthenticatedComponent;
};
