import { forwardRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

const StyledOverlay = forwardRef<
  HTMLDivElement,
  DialogPrimitive.DialogOverlayProps
>((props, ref) => (
  <DialogPrimitive.Overlay
    className="fixed inset-0 z-20 bg-black/50 rdx-state-open:animate-fade-in rdx-state-closed:animate-fade-out"
    {...props}
    ref={ref}
  />
));

const StyledContent = forwardRef<
  HTMLDivElement,
  DialogPrimitive.DialogContentProps
>((props, ref) => (
  <DialogPrimitive.Content
    className="fixed z-50 w-[95vw] max-w-md rounded-lg p-4 md:w-full top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-white dark:bg-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 rdx-state-open:animate-fade-in-scale rdx-state-closed:animate-fade-out"
    {...props}
    ref={ref}
  />
));

export const DialogContent = ({
  children,
  ...props
}: DialogPrimitive.DialogContentProps) => {
  return (
    <DialogPrimitive.Portal>
      <StyledOverlay />
      <StyledContent {...props}>{children}</StyledContent>
    </DialogPrimitive.Portal>
  );
};

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.DialogDescription;
export const DialogClose = DialogPrimitive.DialogClose;
