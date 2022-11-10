import { ReactNode } from 'react';
import { NextPage } from 'next';
import { useSelector } from 'react-redux';

import { useUserInfoQuery } from '@catstack/catwatch/data-access';

import { selectUser } from './auth-slice.selectors';

export interface WithAuthConfig {
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

export const withAuth = (Component: NextPage) => (config?: WithAuthConfig) => {
  const AuthenticatedComponent = () => {
    const { isError, isFetching } = useUserInfoQuery();
    const user = useSelector(selectUser);

    if (isFetching) return config?.loadingComponent || null;

    if (isError) return <div>Error</div>;

    if (!user) return <div>Not authenticated</div>;

    if (user) return <Component />;

    return null;
  };

  return AuthenticatedComponent;
};
