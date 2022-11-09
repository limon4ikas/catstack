import { PropsWithChildren } from 'react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
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
        <AlertDialogTitle>New video file</AlertDialogTitle>
        <AlertDialogDescription>
          User suggested to download torrent file for media playback, do you
          want to continue
        </AlertDialogDescription>
        <AlertDialogAction onClick={props.onConfirm}>Yes</AlertDialogAction>
        <AlertDialogCancel onClick={props.onCancel}>Cancel</AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );
};
