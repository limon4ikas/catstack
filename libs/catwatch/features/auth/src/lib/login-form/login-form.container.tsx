// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { useLoginMutation } from '@catstack/catwatch/data-access';

import { LoginForm, LoginFormValues } from './login-form';

export const LoginFormContainer = () => {
  const [login] = useLoginMutation();

  const handleLoginFormSubmit = async (values: LoginFormValues) => {
    const { shouldRemember, ...rest } = values;

    const { access_token } = await login(rest).unwrap();
    console.log('GOT ACCESS TOKEN', access_token);
  };

  return <LoginForm onSubmit={handleLoginFormSubmit} />;
};
