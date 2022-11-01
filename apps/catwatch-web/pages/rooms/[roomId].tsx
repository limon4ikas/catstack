import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

import { Button, Layout } from '@catstack/shared/vanilla';
import {
  CatPeer,
  getSocket,
  useAppSelector,
  useGetRoomUsersQuery,
  useJoinRoomMutation,
  useLeaveRoomMutation,
} from '@catstack/catwatch/data-access';
import { selectUser, withAuth } from '@catstack/catwatch/features/auth';

export interface UseRoomConfig {
  roomId: string;
}

const useRoom = ({ roomId }: UseRoomConfig) => {
  const { data, isLoading, isError } = useGetRoomUsersQuery(roomId);
  const [leaveRoom] = useLeaveRoomMutation();
  const [joinRoom] = useJoinRoomMutation();
  const { id } = useAppSelector(selectUser);

  return {
    id,
    users: data,
    joinRoom,
    leaveRoom,
    isError,
    isLoading,
  } as const;
};

export interface UsersListContainerProps {
  roomId: string;
}

const UsersListContainer = ({ roomId }: UsersListContainerProps) => {
  const { id, users, isLoading, isError, joinRoom, leaveRoom } = useRoom({
    roomId,
  });

  useEffect(() => {
    (async () => joinRoom(roomId))();

    return () => {
      leaveRoom(roomId);
    };
  }, [joinRoom, leaveRoom, roomId]);

  const peerRef = useRef<CatPeer>();
  const createPeer = () => {
    const pc = new CatPeer({
      userId: id,
      remoteUserId: id === 1 ? 2 : 1,
      socket: getSocket(),
    });

    peerRef.current = pc;
  };
  useEffect(createPeer, []);

  const call = async () => {
    const pc = peerRef.current;
    await pc.start();
  };

  if (isError) return <h1>Something went wrong</h1>;

  if (isLoading) return <h1>Loading</h1>;

  if (!users) return <h1>No users</h1>;

  return (
    <div>
      <Button onClick={call}>Call</Button>
      <ul className="flex flex-col gap-4">
        {Object.values(users.entities).map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
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
