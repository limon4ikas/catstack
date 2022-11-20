import { forwardRef } from 'react';
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
import { UserMenu } from './user-menu';

// eslint-disable-next-line @typescript-eslint/ban-types
export const NotificationsBell = forwardRef<HTMLButtonElement, {}>(
  (props, ref) => {
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
  }
);

export interface UserProfileAvatarProps {
  username?: string;
  isSocketConnected?: boolean;
}

export const UserProfileAvatar = forwardRef<
  HTMLDivElement,
  UserProfileAvatarProps
>((props, ref) => {
  return (
    <div className="relative" ref={ref}>
      <div>
        <div className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span className="sr-only">Open user menu</span>
          <Avatar
            username={props.username || ''}
            isOnline={props.isSocketConnected}
          />
        </div>
      </div>
    </div>
  );
});
export interface UserProfileProps {
  username?: string;
  isSocketConnected?: boolean;
  onLogoutClick?: () => void;
}

export const UserProfile = (props: UserProfileProps) => {
  const { username, isSocketConnected, onLogoutClick } = props;

  return (
    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:gap-4">
      <NotificationsBell />
      <Popover modal>
        <PopoverTrigger>
          <UserProfileAvatar
            isSocketConnected={isSocketConnected}
            username={username}
          />
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={4}>
          <UserMenu onLogoutClick={onLogoutClick} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const UserProfileContainer = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { username } = useAuthUser();
  const isSocketConnected = useSocketIsOnline();

  const handleLogoutClick = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <UserProfile
      username={username}
      isSocketConnected={isSocketConnected}
      onLogoutClick={handleLogoutClick}
    />
  );
};
