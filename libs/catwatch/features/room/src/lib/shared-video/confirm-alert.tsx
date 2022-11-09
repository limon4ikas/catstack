import { PropsWithChildren } from 'react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  Button,
} from '@catstack/shared/vanilla';

export interface DownloadConfirmAlertProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DownloadConfirmAlert = (
  props: PropsWithChildren<DownloadConfirmAlertProps>
) => {
  return (
    <AlertDialog open={props.isOpen}>
      <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
          New video file
        </AlertDialogTitle>
        <AlertDialogDescription className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
          User suggested to download torrent file for media playback, do you
          want to continue?
        </AlertDialogDescription>
        <div className="flex gap-4 mt-4 justify-end">
          <AlertDialogAction onClick={props.onConfirm} asChild>
            <Button>Yes</Button>
          </AlertDialogAction>
          <AlertDialogCancel onClick={props.onCancel} asChild>
            <Button variant="secondary">No</Button>
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
