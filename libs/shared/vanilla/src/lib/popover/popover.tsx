import { forwardRef } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cva } from '@catstack/shared/utils';

const popoverStyles = cva([
  'rdx-side-top:animate-slide-up rdx-side-bottom:animate-slide-down',
]);

export const PopoverContent = forwardRef<
  HTMLDivElement,
  PopoverPrimitive.PopoverContentProps
>((props, ref) => {
  return (
    <PopoverPrimitive.Content {...props} className={popoverStyles()} ref={ref}>
      {props.children}
    </PopoverPrimitive.Content>
  );
});

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverPortal = PopoverPrimitive.Portal;
export const PopoverClose = PopoverPrimitive.Close;
export const PopoverArrow = PopoverPrimitive.Arrow;
