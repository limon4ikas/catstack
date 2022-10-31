import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Layout } from '@catstack/shared/vanilla';
import {
  useGetRoomUsersQuery,
  useJoinRoomMutation,
  useLeaveRoomMutation,
} from '@catstack/catwatch/data-access';
import { withAuth } from '@catstack/catwatch/features/auth';

export interface UseRoomConfig {
  roomId: string;
}

const useRoom = ({ roomId }: UseRoomConfig) => {
  const { data, isLoading, isError } = useGetRoomUsersQuery(roomId);
  const [leaveRoom] = useLeaveRoomMutation();
  const [joinRoom] = useJoinRoomMutation();

  useEffect(() => {
    (async () => {
      await joinRoom(roomId);
    })();

    return () => {
      leaveRoom(roomId);
    };
  }, [roomId, joinRoom, leaveRoom]);

  return { users: data, joinRoom, leaveRoom, isError, isLoading } as const;
};

export interface UsersListContainerProps {
  roomId: string;
}

const UsersListContainer = ({ roomId }: UsersListContainerProps) => {
  const { users, isLoading, isError } = useRoom({ roomId });

  if (isError) return <h1>Something went wrong</h1>;

  if (isLoading) return <h1>Loading</h1>;

  if (!users) return <h1>No users</h1>;

  return (
    <div className="flex flex-col gap-4">
      {Object.values(users.entities).map((user) => (
        <div key={user.id}>{user.username}</div>
      ))}
    </div>
  );
};

export const RoomPage: NextPage = () => {
  const router = useRouter();
  const roomId = router.query?.roomId as string | undefined;

  if (!roomId) return null;

  return (
    <Layout header={`Room ${roomId}`}>
      <UsersListContainer roomId={roomId} />
    </Layout>
  );
};

export default withAuth(RoomPage)();
