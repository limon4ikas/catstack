import { forwardRef } from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

import { cva } from '@catstack/shared/utils';

import { DialogOverlay } from '../dialog';

const alertDialogContentStyles = cva([
  'fixed z-50',
  'w-[95vw] max-w-md rounded-lg p-4 md:w-full',
  'top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]',
  'bg-white dark:bg-gray-800',
  'focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75',
]);

export const AlertDialogContent = forwardRef<
  HTMLDivElement,
  AlertDialogPrimitive.AlertDialogContentProps
>((props, ref) => {
  return (
    <AlertDialogPrimitive.Content
      className={alertDialogContentStyles()}
      {...props}
      ref={ref}
    >
      {props.children}
    </AlertDialogPrimitive.Content>
  );
});

export const AlertDialogOverlay = DialogOverlay;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogTitle = AlertDialogPrimitive.Title;
export const AlertDialogDescription = AlertDialogPrimitive.Description;
export const AlertDialogAction = AlertDialogPrimitive.Action;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;
