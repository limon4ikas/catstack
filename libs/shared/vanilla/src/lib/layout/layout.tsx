import { PropsWithChildren, ReactNode } from 'react';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex">
      <div className="flex items-center flex-shrink-0 gap-4 dark:text-white">
        <span className="text-xl font-bold">Catwatch</span>
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
        Join
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
    <div className="flex flex-col h-full overflow-hidden">
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
