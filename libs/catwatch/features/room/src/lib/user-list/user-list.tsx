import { getSocket } from '@catstack/catwatch/data-access';
import { UserProfile } from '@catstack/catwatch/types';
import { useCatPeer } from '@catstack/shared/rtc';
import { Button } from '@catstack/shared/vanilla';

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

  const pc = useCatPeer({ id: user.id, remoteId: 2, socket: getSocket() });
  const call = async () => await pc.start();

  if (isError) return <h1>Something went wrong</h1>;

  if (isLoading) return <h1>Loading</h1>;

  if (!users.length) return <h1>No users</h1>;

  return (
    <div>
      <Button onClick={call}>Call</Button>
      <UserList users={users} />
    </div>
  );
};
