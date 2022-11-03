import { ReactNode, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { useUserInfoQuery } from '@catstack/catwatch/data-access';

import { selectUser } from './auth-slice';

export interface WithAuthConfig {
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

export const withAuth = (Component: NextPage) => (config?: WithAuthConfig) => {
  const AuthenticatedComponent = () => {
    const { data, error, isLoading } = useUserInfoQuery();
    const user = useSelector(selectUser);
    const router = useRouter();

    useEffect(() => {
      if (error) router.push(config?.redirectTo || '/auth/login');
    }, [error, router]);

    if (isLoading) return config?.loadingComponent || null;

    if (user) return <Component />;

    if (!data) return null;

    return <Component />;
  };

  return AuthenticatedComponent;
};
