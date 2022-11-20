import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { UserList, UserListEmpty, UserListError } from './user-list';

const Story: ComponentMeta<typeof UserList> = {
  component: UserList,
  title: 'screens/Room Screen/User List',
  decorators: [
    (story) => (
      <div className="p-4 bg-white rounded-lg dark:bg-gray-700 w-80">
        {story()}
      </div>
    ),
  ],
};
export default Story;

export const Primary: ComponentStory<typeof UserList> = (args) => {
  return (
    <UserList
      users={[
        { id: 1, isConnected: true, username: 'limonikas', stream: undefined },
        { id: 1, isConnected: false, username: 'alisikka', stream: undefined },
      ]}
    />
  );
};

export const ListError = () => {
  return <UserListError />;
};

export const ListEmpty = () => {
  return <UserListEmpty />;
};
