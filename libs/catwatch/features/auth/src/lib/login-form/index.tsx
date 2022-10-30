import { NextPage } from 'next';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  useAppSelector,
  useUserInfoQuery,
} from '@catstack/catwatch/data-access';

import { selectUser } from './auth-slice';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export * from './login-form';
export * from './login-form.container';
export * from './auth-slice';

export interface WithAuthConfig {
  redirectTo?: string;
}

export const withAuth = (Component: NextPage) => (config: WithAuthConfig) => {
  const AuthenticatedComponent = () => {
    const user = useAppSelector(selectUser);
    const { data, error, isLoading } = useUserInfoQuery();
    const router = useRouter();

    useEffect(() => {
      if (error) router.push(config.redirectTo || '/auth/login');
    }, [error, router]);

    if (user) return <Component />;

    if (isLoading) return <h1>SplashScreen</h1>;

    if (!data) return <h1>Something went wrong!!!</h1>;

    return <Component />;
  };

  return AuthenticatedComponent;
};
