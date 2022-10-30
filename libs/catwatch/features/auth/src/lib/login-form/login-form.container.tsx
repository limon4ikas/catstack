// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { useLoginMutation } from '@catstack/catwatch/data-access';
import { useRouter } from 'next/router';

import { LoginForm, LoginFormValues } from './login-form';

export const LoginFormContainer = () => {
  const router = useRouter();
  const [login] = useLoginMutation();

  const handleLoginFormSubmit = async (values: LoginFormValues) => {
    const { shouldRemember, ...rest } = values;

    await login(rest);
    router.push('/');
  };

  return <LoginForm onSubmit={handleLoginFormSubmit} />;
};
