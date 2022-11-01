import { ComponentPropsWithRef, forwardRef } from 'react';

export type InputProps = ComponentPropsWithRef<'input'>;

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <div className="relative px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600">
      <label
        htmlFor="name"
        className="absolute inline-block px-1 -mt-px text-xs font-medium text-gray-900 bg-white -top-2 left-2"
      >
        Name
      </label>
      <input
        type="text"
        className="block w-full p-0 text-gray-900 placeholder-gray-500 border-0 focus:ring-0 sm:text-sm"
        {...props}
        ref={ref}
      />
    </div>
  );
});