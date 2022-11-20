import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { StartScreen } from './start-screen';
import {
  StartScreenContextProvider,
  IStartScreenContext,
} from './start-screen.context';
import { CreateRoom } from './create-room';
import { JoinRoom } from './join-room';

const Story: ComponentMeta<typeof StartScreen> = {
  component: StartScreen,
  title: 'screens/Start Screen',
};
export default Story;

const context: IStartScreenContext = {
  CreateRoomContainer: CreateRoom,
  JoinRoomFormContainer: JoinRoom,
};

const Template: ComponentStory<typeof StartScreen> = (args) => (
  <StartScreenContextProvider value={context}>
    <StartScreen {...args} />
  </StartScreenContextProvider>
);

export const Primary = Template.bind({});
Primary.args = {};
