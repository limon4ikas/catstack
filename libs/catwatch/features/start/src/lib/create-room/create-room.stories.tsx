import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { CreateRoom } from './create-room';

const Story: ComponentMeta<typeof CreateRoom> = {
  component: CreateRoom,
  title: 'components/Create Room',
};
export default Story;

const Template: ComponentStory<typeof CreateRoom> = (args) => (
  <CreateRoom {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
