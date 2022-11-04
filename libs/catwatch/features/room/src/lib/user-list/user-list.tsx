import { UserProfile } from '@catstack/catwatch/types';
import { Avatar } from '@catstack/shared/vanilla';

import { useRoom } from '../hooks/use-room';

export interface UserListProps {
  users: UserProfile[];
}

export const UserList = (props: UserListProps) => {
  return (
    <ul className="flex flex-col gap-4 pt-3">
      {props.users.map((user) => (
        <li key={user.id} className="flex items-center gap-3 px-2">
          <Avatar username={user.username} />
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            {user.username}
          </span>
        </li>
      ))}
    </ul>
  );
};

export interface UsersListContainerProps {
  roomId: string;
}

export const UsersListContainer = ({ roomId }: UsersListContainerProps) => {
  const { user, users, isLoading, isError } = useRoom({ roomId });

  if (isError) return <h1>Something went wrong</h1>;

  if (isLoading) return <h1>Loading</h1>;

  if (!users.length) return <h1>No users</h1>;

  return (
    <div className="flex flex-col gap-4">
      <UserList users={users} />
    </div>
  );
};
