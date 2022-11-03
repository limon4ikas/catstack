import { useSelector } from 'react-redux';

import { useGetRoomUsersQuery } from '@catstack/catwatch/data-access';
import { selectUser } from '@catstack/catwatch/features/auth';
import { UserProfile } from '@catstack/catwatch/types';

export interface UseRoomConfig {
  roomId: string;
}

export const useRoom = ({ roomId }: UseRoomConfig) => {
  const { data, isLoading, isError } = useGetRoomUsersQuery(roomId);
  const user = useSelector(selectUser);

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
