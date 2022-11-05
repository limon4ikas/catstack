import { PropsWithChildren } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Avatar } from '../avatar';

const Logo = () => {
  return (
    <Link href="/" className="flex">
      <div className="flex items-center flex-shrink-0">
        <img
          className="block w-auto h-8 lg:hidden"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          alt="Catwatch"
        />
        <img
          className="hidden w-auto h-8 lg:block"
          src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
          alt="Catwatch"
        />
      </div>
      <div />
    </Link>
  );
};

const User = () => {
  return (
    <div className="hidden sm:ml-6 sm:flex sm:items-center">
      <button
        type="button"
        className="p-1 text-gray-400 bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span className="sr-only">View notifications</span>
        <BellIcon className="w-6 h-6" aria-hidden="true" />
      </button>
      <div className="relative ml-3">
        <div>
          <button className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="sr-only">Open user menu</span>
            <Avatar username="Test" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Navigation = () => {
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/"
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-50 hover:text-gray-900"
      >
        Room
      </Link>
      <Link
        href="/convert"
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-50 hover:text-gray-900"
      >
        Convert
      </Link>
    </div>
  );
};

export const Layout = (props: PropsWithChildren) => {
  return (
    <div className="h-full">
      <nav className="fixed top-0 w-full bg-white shadow-sm">
        <div className="px-4 mx-auto sm:px-6 lg:px-8">
          <header className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <Logo />
              <Navigation />
            </div>
            <User />
          </header>
        </div>
      </nav>
      {props.children}
    </div>
  );
};
