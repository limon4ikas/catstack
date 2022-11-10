import { PropsWithChildren, ReactNode } from 'react';
import { NextPage } from 'next';
import { useSelector } from 'react-redux';

import { useUserInfoQuery } from '@catstack/catwatch/data-access';

import { selectUser } from './auth-slice.selectors';
import { useRouter } from 'next/router';

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const user = useSelector(selectUser);

  if (typeof window !== 'undefined' && !user) router.push('/auth/login');

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export interface WithAuthConfig {
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

export const withAuth = (Component: NextPage) => (config?: WithAuthConfig) => {
  const AuthenticatedComponent = () => {
    const { isError, isFetching } = useUserInfoQuery();
    const user = useSelector(selectUser);

    if (isFetching) return config?.loadingComponent || null;

    if (isError || !user) return <ProtectedRoute />;

    if (user) return <Component />;

    return null;
  };

  return AuthenticatedComponent;
};
