import { forwardRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

import { Avatar, Popover, PopoverContent } from '@catstack/shared/vanilla';
import { useSocketIsOnline } from '@catstack/catwatch/data-access';

import { useAuth } from '../auth-slice';
import { PopoverTrigger } from '@radix-ui/react-popover';
import Link from 'next/link';
import { useRouter } from 'next/router';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NotificationBellProps = {};

export const NotificationsBell = forwardRef<
  HTMLButtonElement,
  NotificationBellProps
>((props, ref) => {
  return (
    <button
      type="button"
      className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-white dark:bg-gray-800 dark:hover:text-white"
      {...props}
      ref={ref}
    >
      <span className="sr-only">View notifications</span>
      <BellIcon className="w-6 h-6" aria-hidden="true" />
    </button>
  );
});

export interface UserProfileProps {
  isSocketConnected: boolean;
  username: string;
}

export const UserProfile = forwardRef<HTMLDivElement, UserProfileProps>(
  (props, ref) => {
    return (
      <div className="relative ml-3" ref={ref}>
        <div>
          <div className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="sr-only">Open user menu</span>
            <Avatar
              username={props.username}
              isOnline={props.isSocketConnected}
            />
          </div>
        </div>
      </div>
    );
  }
);

export const UserProfileContainer = () => {
  const { username } = useAuth();
  const isSocketConnected = useSocketIsOnline();
  const router = useRouter();

  const handleLogoutClick = () => {
    router.push('/auth/login');
  };

  return (
    <div className="hidden sm:ml-6 sm:flex sm:items-center">
      <NotificationsBell />
      <Popover>
        <PopoverTrigger>
          <UserProfile
            isSocketConnected={isSocketConnected}
            username={username}
          />
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={4}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-48 shadow-md flex flex-col gap-4">
            <Link
              href="/user/profile"
              className="text-gray-700 dark:text-gray-300"
            >
              Profile
            </Link>
            <Link
              href="/user/settings"
              className="text-gray-700 dark:text-gray-300"
            >
              Settings
            </Link>
            <button
              onClick={handleLogoutClick}
              className="text-gray-700 dark:text-gray-300"
            >
              Logout
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
