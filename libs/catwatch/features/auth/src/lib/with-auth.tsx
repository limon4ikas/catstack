import { NextPage } from 'next';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';

import { useUserInfoQuery } from '@catstack/catwatch/data-access';
import { useAppSelector } from '@catstack/catwatch/store';

import { selectUser } from './auth-slice';

export interface WithAuthConfig {
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

export const withAuth = (Component: NextPage) => (config?: WithAuthConfig) => {
  const AuthenticatedComponent = () => {
    const user = useAppSelector(selectUser);
    const { data, error, isLoading } = useUserInfoQuery();
    const router = useRouter();

    useEffect(() => {
      if (error) router.push(config?.redirectTo || '/auth/login');
    }, [error, router]);

    if (user) return <Component />;

    if (isLoading) return config?.loadingComponent || null;

    if (!data) return <h1>Something went wrong!!!</h1>;

    return <Component />;
  };

  return AuthenticatedComponent;
};
