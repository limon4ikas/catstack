import { ComponentPropsWithRef, forwardRef } from 'react';

import { cva, VariantProps } from 'class-variance-authority';

const buttonStyles = cva(
  'inline-flex items-center font-medium shadow-sm transition-colors',
  {
    variants: {
      variant: {
        primary:
          'text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border border-transparent',
        secondary:
          'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border border-transparent',
        white:
          'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
      },
      size: {
        sm: 'px-2.5 py-1.5 text-xs rounded',
        md: 'px-3 py-2 text-sm leading-4 rounded-md',
        lg: 'px-4 py-2 text-sm rounded-md',
        xl: 'px-4 py-2 text-base rounded-md',
        '2xl': 'px-6 py-3 text-base rounded-md',
      },
      rounded: { full: 'rounded-full' },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
    compoundVariants: [],
  }
);

export type ButtonProps = ComponentPropsWithRef<'button'> &
  VariantProps<typeof buttonStyles>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, rounded, className, children, ...props }, ref) => {
    return (
      <button
        type="button"
        className={buttonStyles({
          variant,
          size,
          rounded,
          class: className,
        })}
        {...props}
        ref={ref}
      >
        {children}
      </button>
    );
  }
);
