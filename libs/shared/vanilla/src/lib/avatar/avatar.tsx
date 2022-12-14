import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cx } from '@catstack/shared/utils';

export type AvatarProps = AvatarPrimitive.AvatarProps & {
  username: string;
  isOnline?: boolean;
  src?: string;
};

export const Avatar = ({ username, isOnline, src, ...props }: AvatarProps) => (
  <AvatarPrimitive.Root
    className="relative inline-flex w-10 h-10 select-none"
    {...props}
  >
    <AvatarPrimitive.Image
      src={src}
      alt="Avatar"
      className="object-cover w-full h-full rounded-full"
    />

    <div className="absolute bottom-0 right-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2">
      <span
        className={cx(
          'block h-2.5 w-2.5 rounded-full',
          typeof isOnline !== 'undefined'
            ? isOnline
              ? 'bg-green-400'
              : 'bg-red-400'
            : undefined
        )}
      />
    </div>

    <AvatarPrimitive.Fallback
      className="flex items-center justify-center w-full h-full bg-gray-400 rounded-full dark:bg-gray-600"
      delayMs={600}
    >
      <span className="text-sm font-medium text-white uppercase dark:text-white">
        {username.slice(0, 2).toUpperCase()}
      </span>
    </AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
);
