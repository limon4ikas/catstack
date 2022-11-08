import { BellIcon } from '@heroicons/react/24/outline';

import { Avatar } from '@catstack/shared/vanilla';
import { useSocket } from '@catstack/catwatch/data-access';

import { useAuth } from '../auth-slice';
import { useEffect, useState } from 'react';

export interface UserProfileProps {
  isSocketConnected: boolean;
  username: string;
}

export const UserProfile = (props: UserProfileProps) => {
  return (
    <div className="hidden sm:ml-6 sm:flex sm:items-center">
      <button
        type="button"
        className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-white dark:bg-gray-800 dark:hover:text-white"
      >
        <span className="sr-only">View notifications</span>
        <BellIcon className="w-6 h-6" aria-hidden="true" />
      </button>
      <div className="relative ml-3">
        <div>
          <button className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="sr-only">Open user menu</span>
            <Avatar
              username={props.username}
              isOnline={props.isSocketConnected}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export const UserProfileContainer = () => {
  const { username } = useAuth();
  const socket = useSocket();
  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);

  const handleConnected = () => setIsSocketConnected(true);
  const handleDisconnected = () => setIsSocketConnected(false);

  useEffect(() => {
    socket.on('connect', handleConnected);
    socket.on('disconnect', handleDisconnected);

    return () => {
      socket.off('connect', handleConnected);
      socket.off('disconnect', handleDisconnected);
    };
  });

  return (
    <UserProfile isSocketConnected={isSocketConnected} username={username} />
  );
};
