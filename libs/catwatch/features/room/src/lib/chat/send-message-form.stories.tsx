import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { SendMessageForm } from './chat';

const Story: ComponentMeta<typeof SendMessageForm> = {
  component: SendMessageForm,
  title: 'components/Send Message Form',
};
export default Story;

const Template: ComponentStory<typeof SendMessageForm> = (args) => (
  <SendMessageForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
