import { useRouter } from 'next/router';

import { useAuth } from '../auth-slice';

import { LoginForm, LoginFormValues } from './login-form';

export const LoginFormContainer = () => {
  const router = useRouter();
  const { login } = useAuth();

  const handleLoginFormSubmit = async (values: LoginFormValues) => {
    const { username, password } = values;

    await login(username, password);
    await router.push('/');
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
