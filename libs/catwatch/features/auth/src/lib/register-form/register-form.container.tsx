import { RegisterForm, RegisterFormValues } from './register-form';

export const RegisterFormContainer = () => {
  const handleRegisterSubmit = (data: RegisterFormValues) => {
    console.log('FORM SUBMIT', data);
  };

  return <RegisterForm onSubmit={handleRegisterSubmit} />;
};
