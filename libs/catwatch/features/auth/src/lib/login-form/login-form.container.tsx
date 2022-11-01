// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { useLoginMutation } from '@catstack/catwatch/data-access';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { LoginForm, LoginFormValues } from './login-form';

export const LoginFormContainer = () => {
  const router = useRouter();
  const [login] = useLoginMutation();
  const [isNavigating, setIsNavigation] = useState(false);

  const handleNavStart = () => setIsNavigation(true);
  const handleNavEnd = () => setIsNavigation(false);

  useEffect(() => {
    router.events.on('routeChangeStart', handleNavStart);
    router.events.on('routeChangeComplete', handleNavStart);

    return () => {
      router.events.off('routeChangeStart', handleNavStart);
      router.events.off('routeChangeComplete', handleNavEnd);
    };
  });

  const handleLoginFormSubmit = async (values: LoginFormValues) => {
    const { shouldRemember, ...rest } = values;

    await login(rest);
    if (isNavigating) return;
    await router.push('/rooms');
  };

  return <LoginForm onSubmit={handleLoginFormSubmit} />;
};
