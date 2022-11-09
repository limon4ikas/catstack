import { useEffect } from 'react';
import { useRouter } from 'next/router';

import {
  useLazyUserInfoQuery,
  useLoginMutation,
} from '@catstack/catwatch/data-access';

import { LoginForm, LoginFormValues } from './login-form';

export const LoginFormContainer = () => {
  const router = useRouter();
  const [login] = useLoginMutation();
  const [getUserInfo] = useLazyUserInfoQuery();

  useEffect(() => {
    router.prefetch('/rooms');
  }, [router]);

  const handleLoginFormSubmit = async (values: LoginFormValues) => {
    const { shouldRemember, ...rest } = values;

    try {
      await login(rest);
      await getUserInfo();
      await router.push('/');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <LoginForm
      onSubmit={handleLoginFormSubmit}
      defaultValues={{
        password: 'xuwi389fa',
        username: 'limonikas',
        shouldRemember: false,
      }}
    />
  );
};
