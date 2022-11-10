import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { UserProfile } from '@catstack/catwatch/types';
import { useGetRoomUsersQuery } from '@catstack/catwatch/data-access';
import { Avatar } from '@catstack/shared/vanilla';
import { useAuthUser } from '@catstack/catwatch/features/auth';

import { getUsersWithConnections } from '../room-slice.selectors';
import { useRoomContext } from '../context';

type UserWithMedia = UserProfile & {
  isConnected: boolean;
  stream?: MediaStream;
};

export interface UserListItemProps {
  user: UserWithMedia;
}

export const UserListItem = ({ user }: UserListItemProps) => {
  const attachStream = useCallback(
    (node: HTMLVideoElement | null) => {
      if (!node || !user.stream) return;

      node.srcObject = user.stream;
    },
    [user.stream]
  );

  return (
    <li key={user.id} className="flex items-center gap-3 px-4">
      <div className="flex items-center w-full gap-2 px-4 py-2 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
        {user?.stream ? (
          <video
            width={40}
            height={40}
            autoPlay
            ref={attachStream}
            className="rounded-full"
          />
        ) : (
          <Avatar username={user.username} isOnline={user.isConnected} />
        )}
        <span className="text-base font-medium text-gray-700 group-hover:text-gray-900 dark:text-white">
          {user.username}
        </span>
      </div>
    </li>
  );
};

export interface UserListProps {
  users: UserWithMedia[];
}

export const UserList = (props: UserListProps) => {
  return (
    <ul className="flex flex-col gap-4 pt-3">
      {props.users.map((user) => (
        <UserListItem key={user.id} user={user} />
      ))}
    </ul>
  );
};

const UserListLoading = () => {
  return <h1>Loading</h1>;
};

const UserListError = () => {
  return <h1>Something went wrong</h1>;
};

const UserListEmpty = () => {
  return (
    <div className="flex justify-center pt-3">
      <h1 className="text-lg font-medium text-gray-900 dark:text-white">
        No users
      </h1>
    </div>
  );
};

export interface UsersListContainerProps {
  roomId: string;
}

export const UsersListContainer = ({ roomId }: UsersListContainerProps) => {
  const { id: userId } = useAuthUser();
  const { streams } = useRoomContext();
  const users = useSelector(getUsersWithConnections(userId));
  const { isLoading, isError } = useGetRoomUsersQuery(roomId);

  const usersWithStreams = users.map((user) => ({
    ...user,
    stream: streams[user.id],
  }));

  if (isError) return <UserListError />;

  if (isLoading) return <UserListLoading />;

  if (!users.length) <UserListEmpty />;

  return (
    <div className="flex flex-col gap-4">
      <UserList users={usersWithStreams} />
    </div>
  );
};
