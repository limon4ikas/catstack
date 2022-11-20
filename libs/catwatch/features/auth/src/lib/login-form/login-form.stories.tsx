import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { LoginForm } from './login-form';

const Story: ComponentMeta<typeof LoginForm> = {
  component: LoginForm,
  title: 'components/Login Form',
  argTypes: { onSubmit: { action: 'onSubmit executed!' } },
  parameters: { layout: 'fullscreen' },
};
export default Story;

const Template: ComponentStory<typeof LoginForm> = (args) => (
  <LoginForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
