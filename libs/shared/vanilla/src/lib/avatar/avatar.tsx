import * as AvatarPrimitive from '@radix-ui/react-avatar';

export type AvatarProps = AvatarPrimitive.AvatarProps & {
  username: string;
};

export const Avatar = (props: AvatarProps) => (
  <AvatarPrimitive.Root
    className="inline-flex items-center justify-center overflow-hidden align-middle rounded-full select-none w-11 h-11"
    {...props}
  >
    <AvatarPrimitive.Fallback
      delayMs={600}
      className="flex items-center justify-center w-8 h-8 bg-gray-500 rounded-full"
    >
      <span className="text-xs font-medium leading-none text-white">
        {props.username.slice(0, 2).toUpperCase()}
      </span>
    </AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
);
