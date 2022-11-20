import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Avatar } from './avatar';

const Story: ComponentMeta<typeof Avatar> = {
  component: Avatar,
  title: 'components/Avatar',
};
export default Story;

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  username: 'limonikas',
  isOnline: false,
  src: '',
};

export const Online = Template.bind({});
Online.args = {
  ...Primary.args,
  isOnline: true,
};

export const Offline = Template.bind({});
Offline.args = {
  ...Primary.args,
  isOnline: false,
};

export const WithoutOnlineStatus = Template.bind({});
WithoutOnlineStatus.args = {
  ...Primary.args,
  isOnline: undefined,
};
