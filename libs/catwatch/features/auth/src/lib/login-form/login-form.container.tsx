import { LoginForm, LoginFormValues } from './login-form';

import { useLoginMutation } from '@catstack/catwatch/data-access';

export const LoginFormContainer = () => {
  const [login] = useLoginMutation();

  const handleLoginFormSubmit = (values: LoginFormValues) => {
    const { shouldRemember, ...rest } = values;

    login(rest);
  };

  return <LoginForm onSubmit={handleLoginFormSubmit} />;
};
