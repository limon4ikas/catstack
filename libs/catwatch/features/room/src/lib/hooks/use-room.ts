import { useEffect } from 'react';

import {
  useGetRoomUsersQuery,
  useLeaveRoomMutation,
  useJoinRoomMutation,
  useAppSelector,
} from '@catstack/catwatch/data-access';
import { selectUser } from '@catstack/catwatch/features/auth';
import { UserProfile } from '@catstack/catwatch/types';

export interface UseRoomConfig {
  roomId: string;
}

export const useRoom = ({ roomId }: UseRoomConfig) => {
  const { data, isLoading, isError } = useGetRoomUsersQuery(roomId);
  const [leaveRoom] = useLeaveRoomMutation();
  const [joinRoom] = useJoinRoomMutation();
  const user = useAppSelector(selectUser) as UserProfile;

  useEffect(() => {
    (async () => joinRoom(roomId))();

    return () => {
      leaveRoom(roomId);
    };
  }, [joinRoom, leaveRoom, roomId]);

  const users = Object.values(data?.entities || {})
    .filter((user): user is UserProfile => !!user)
    .map((user) => user);

  return {
    user,
    users,
    isError,
    isLoading,
  } as const;
};
