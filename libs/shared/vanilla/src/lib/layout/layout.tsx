import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const navigation = [{ name: 'Rooms', href: '/rooms' }];

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

export interface LayoutProps {
  header: string;
}

export const Layout = (props: PropsWithChildren<LayoutProps>) => {
  const router = useRouter();

  return (
    <div className="min-h-full">
      <header className="bg-white shadow">
        <div className="flex items-baseline py-4 ml-10 space-x-4">
          {navigation.map((item) => {
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={
                  item.href === router.pathname ? 'page' : undefined
                }
              >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  className={classNames(
                    item.href === router.pathname
                      ? 'bg-blue-900 text-white'
                      : 'text-gray-300 hover:bg-blue-700 hover:text-white',
                    'px-3 py-2 rounded-md text-sm font-medium bg-blue-500'
                  )}
                >
                  {item.name}
                </a>
              </Link>
            );
          })}
        </div>
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{props.header}</h1>
        </div>
      </header>
      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {props.children}
        </div>
      </main>
    </div>
  );
};
