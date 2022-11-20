import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { JoinRoom } from './join-room';

const Story: ComponentMeta<typeof JoinRoom> = {
  component: JoinRoom,
  title: 'components/Join Room',
};
export default Story;

const Template: ComponentStory<typeof JoinRoom> = (args) => (
  <JoinRoom {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
