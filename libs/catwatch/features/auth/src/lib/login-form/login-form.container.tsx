import { useLoginMutation } from '@catstack/catwatch/data-access';
import { useRouter } from 'next/router';

import { LoginForm, LoginFormValues } from './login-form';

export const LoginFormContainer = () => {
  const router = useRouter();
  const [login] = useLoginMutation();

  const handleLoginFormSubmit = async (values: LoginFormValues) => {
    const { shouldRemember, ...rest } = values;

    try {
      await login(rest).unwrap();
      await router.push('/rooms');
    } catch (e) {
      console.log(e);
    }
  };

  return <LoginForm onSubmit={handleLoginFormSubmit} />;
};
