import { LoginForm, LoginFormValues } from './login-form';

export const LoginFormContainer = () => {
  const handleLoginFormSubmit = (data: LoginFormValues) => {
    console.log(data);
  };

  return <LoginForm onSubmit={handleLoginFormSubmit} />;
};
