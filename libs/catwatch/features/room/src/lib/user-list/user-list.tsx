import { UserProfile } from '@catstack/catwatch/types';

import { useRoom } from '../hooks/use-room';

export interface UserListProps {
  users: UserProfile[];
}

export const UserList = (props: UserListProps) => {
  return (
    <ul className="flex flex-col gap-4">
      {props.users.map((user) => (
        <li key={user.id}>{user.username}</li>
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
      <h1 style={{ fontWeight: 600 }}>Logged in as {user?.username}</h1>
      <UserList users={users} />
    </div>
  );
};
