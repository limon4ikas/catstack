import { PropsWithChildren } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

export const Layout = (props: PropsWithChildren) => {
  return (
    <div className="sticky top-0 flex flex-col min-h-full">
      <nav className="bg-white shadow-sm ">
        <div className="px-4 mx-auto sm:px-6 lg:px-8">
          <header className="flex justify-between h-16">
            <div className="flex">
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
            </div>
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
                    <img
                      className="w-8 h-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </button>
                </div>
              </div>
            </div>
          </header>
        </div>
      </nav>
      {props.children}
    </div>
  );
};
