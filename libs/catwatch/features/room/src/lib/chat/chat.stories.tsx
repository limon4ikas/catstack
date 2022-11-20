import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { Chat } from './chat';

const Story: ComponentMeta<typeof Chat> = {
  component: Chat,
  title: 'components/Chat',
  decorators: [
    (story) => (
      <div className="bg-white rounded-md dark:bg-gray-700 w-80">{story()}</div>
    ),
  ],
};
export default Story;

const Template: ComponentStory<typeof Chat> = (args) => <Chat {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  messages: [
    {
      id: '1',
      createdAt: '',
      text: 'alisikka joined chat',
      type: 'chat-event',
    },
    {
      id: '1',
      createdAt: '',
      text: 'Start please! :)',
      type: 'user-message',
      username: 'alisikka',
    },
    {
      id: '1',
      createdAt: '',
      text: 'Hello world :)',
      type: 'user-message',
      username: 'limonikas',
    },
    {
      id: '1',
      createdAt: '',
      text: 'Hey! :)',
      type: 'user-message',
      username: 'John',
    },
    {
      id: '1',
      createdAt: '',
      text: 'Cool movie!',
      type: 'user-message',
      username: 'John',
    },
  ],
};
