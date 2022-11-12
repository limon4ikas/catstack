import { forwardRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BellIcon } from '@heroicons/react/24/outline';

import {
  Avatar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@catstack/shared/vanilla';
import { useSocketIsOnline } from '@catstack/catwatch/data-access';

import { useAuth, useAuthUser } from '../auth-slice';

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
      <div className="relative" ref={ref}>
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
  const router = useRouter();
  const { username } = useAuthUser();
  const { logout } = useAuth();
  const isSocketConnected = useSocketIsOnline();

  const handleLogoutClick = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:gap-4">
      <NotificationsBell />
      <Popover modal>
        <PopoverTrigger>
          <UserProfile
            isSocketConnected={isSocketConnected}
            username={username}
          />
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={4}>
          <div className="flex flex-col w-48 py-1 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <Link
              href="/user/profile"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Profile
            </Link>
            <Link
              href="/user/settings"
              className="block px-4 py-2 text-sm jtext-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Settings
            </Link>
            <button
              onClick={handleLogoutClick}
              className="block px-4 py-2 text-sm text-left jtext-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
