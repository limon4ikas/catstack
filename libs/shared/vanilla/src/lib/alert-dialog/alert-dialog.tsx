import { forwardRef, PropsWithChildren } from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

import { cva } from '@catstack/shared/utils';

import { dialogOverlayStyles } from '../dialog';
import { Button } from '../button';

const alertDialogContentStyles = cva([
  'fixed z-50',
  'w-[95vw] max-w-md rounded-lg p-4 md:w-full',
  'top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]',
  'bg-white dark:bg-gray-800',
  'focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75',
]);

const StyledOverlay = forwardRef<
  HTMLDivElement,
  AlertDialogPrimitive.AlertDialogOverlayProps
>((props, ref) => (
  <AlertDialogPrimitive.Overlay
    {...props}
    className={dialogOverlayStyles()}
    ref={ref}
  />
));

const StyledContent = forwardRef<
  HTMLDivElement,
  AlertDialogPrimitive.DialogContentProps
>((props, ref) => (
  <AlertDialogPrimitive.Content
    className={alertDialogContentStyles()}
    {...props}
    ref={ref}
  />
));

export const AlertDialogContent = forwardRef<
  HTMLDivElement,
  AlertDialogPrimitive.AlertDialogContentProps
>((props, ref) => {
  return (
    <AlertDialogPrimitive.Portal>
      <StyledOverlay />
      <StyledContent {...props} ref={ref}>
        {props.children}
      </StyledContent>
    </AlertDialogPrimitive.Portal>
  );
});

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogOverlay = StyledOverlay;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogTitle = AlertDialogPrimitive.Title;
export const AlertDialogDescription = AlertDialogPrimitive.Description;
export const AlertDialogAction = AlertDialogPrimitive.Action;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;

export interface ConfirmDialogProps
  extends AlertDialogPrimitive.AlertDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = (props: PropsWithChildren<ConfirmDialogProps>) => {
  const {
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
  } = props;

  return (
    <AlertDialog {...props}>
      <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {title}
        </AlertDialogTitle>
        <AlertDialogDescription className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
          {description}
        </AlertDialogDescription>
        <div className="flex justify-end gap-4 mt-4">
          <AlertDialogAction asChild onClick={onConfirm}>
            <Button>{confirmLabel}</Button>
          </AlertDialogAction>
          <AlertDialogCancel asChild onClick={onCancel}>
            <Button variant="secondary">{cancelLabel}</Button>
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
