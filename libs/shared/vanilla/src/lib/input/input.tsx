import { ComponentPropsWithRef, forwardRef, useId } from 'react';

export type InputProps = ComponentPropsWithRef<'input'> & {
  label: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const id = useId();

  return (
    <div className="relative flex-grow transition-colors border border-gray-300 rounded-md shadow-sm focus-within:ring-1 focus-within:ring-indigo-600 focus-within:border-indigo-600 dark:border-gray-700">
      <label
        htmlFor={id}
        className="absolute inline-block px-1 -mt-px text-xs font-medium text-gray-900 bg-white -top-2 left-2 dark:bg-gray-800 dark:text-white"
      >
        {props.label}
      </label>
      <input
        type="text"
        className="block w-full p-0 px-3 py-2 text-gray-900 placeholder-gray-500 bg-transparent border-0 focus:ring-0 sm:text-sm dark:text-white"
        id={id}
        {...props}
        ref={ref}
      />
    </div>
  );
});
