import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { JoinRoom } from './join-room';

const Story: ComponentMeta<typeof JoinRoom> = {
  component: JoinRoom,
  title: 'screens/Start Screen/Join Room',
  argTypes: {
    onJoinRoomSubmit: { action: 'onJoinRoomSubmit executed!' },
  },
};
export default Story;

const Template: ComponentStory<typeof JoinRoom> = (args) => (
  <JoinRoom {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
