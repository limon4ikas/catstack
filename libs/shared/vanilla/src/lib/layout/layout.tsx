import { PropsWithChildren, ReactNode } from 'react';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex">
      <div className="flex items-center flex-shrink-0 dark:text-white">
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

const Navigation = () => {
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/"
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-50 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
      >
        Room
      </Link>
      <Link
        href="/convert"
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-50 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
      >
        Convert
      </Link>
    </div>
  );
};

export interface LayoutProps {
  userProfile: ReactNode;
}

export const Layout = (props: PropsWithChildren<LayoutProps>) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <nav className="bg-white shadow dark:bg-gray-800">
        <div className="px-4 mx-auto sm:px-6 lg:px-8">
          <header className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <Logo />
              <Navigation />
            </div>
            {props.userProfile}
          </header>
        </div>
      </nav>
      {props.children}
    </div>
  );
};
