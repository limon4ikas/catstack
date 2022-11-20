import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { RegisterForm } from './register-form';

const Story: ComponentMeta<typeof RegisterForm> = {
  component: RegisterForm,
  title: 'components/Register Form',
  parameters: { layout: 'fullscreen' },
};
export default Story;

const Template: ComponentStory<typeof RegisterForm> = (args) => (
  <RegisterForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
