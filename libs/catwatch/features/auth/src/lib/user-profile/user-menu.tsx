import { forwardRef } from 'react';
import Link, { LinkProps } from 'next/link';

import { cva } from '@catstack/shared/utils';

const menuLinkStyles = cva([
  'block',
  'px-4',
  'py-2',
  'text-sm',
  'text-left',
  'text-gray-700',
  'dark:text-gray-300',
  'hover:bg-gray-100',
  'dark:hover:bg-gray-700',
  'focus:bg-gray-100',
  'dark:focus:bg-gray-700',
]);

export interface MenuLinkProps extends LinkProps {
  label: string;
}

export const MenuLink = forwardRef<HTMLAnchorElement, MenuLinkProps>(
  ({ label, ...props }, ref) => {
    return (
      <Link className={menuLinkStyles()} {...props} ref={ref}>
        {label}
      </Link>
    );
  }
);

export interface UserMenuProps {
  onLogoutClick: () => void;
}

export const UserMenu = forwardRef<HTMLDivElement, UserMenuProps>(
  (props, ref) => {
    return (
      <div
        className="flex flex-col w-48 py-1 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700"
        ref={ref}
      >
        <MenuLink label="Profile" href="/user/profile" />
        <MenuLink label="Settings" href="/user/settings" />
        <button className={menuLinkStyles()} onClick={props.onLogoutClick}>
          Logout
        </button>
      </div>
    );
  }
);
