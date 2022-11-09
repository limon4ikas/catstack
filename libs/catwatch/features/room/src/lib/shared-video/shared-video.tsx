import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { newTorrentFile } from '@catstack/catwatch/actions';
import { toast } from '@catstack/shared/vanilla';
import { useAuth } from '@catstack/catwatch/features/auth';

import { useRoomContext } from '../context';
import { VideoPlayer } from '../video-player';
import { getRoomState } from '../room-slice.selectors';
import { roomActions } from '../room-slice';
import { DownloadConfirmAlert } from './confirm-alert';
import { CreateTorrentForm } from './create-torrent-form';

export const SharedVideoContainer = () => {
  const dispatch = useDispatch();
  const user = useAuth();
  const { send } = useRoomContext();
  const [file, setFile] = useState<string | null>(null);
  const { isSuggestionAlertOpen, magnetUri } = useSelector(getRoomState);

  const handleCreatedTorrent = async (
    torrentName: string,
    magnetUri: string,
    file: File
  ) => {
    toast(`Seeding torrent ${torrentName}`);
    toast('Copied magnet uri to clipboard!');
    send(newTorrentFile({ magnetUri, user }));
    setFile(URL.createObjectURL(file));
  };

  useEffect(() => () => {
    if (!file) return;
    URL.revokeObjectURL(file);
    setFile(null);
  });

  const content = !file ? (
    <CreateTorrentForm onCreatedTorrent={handleCreatedTorrent} />
  ) : (
    <VideoPlayer file={file} />
  );

  const handleConfirm = () => {
    console.log('CONFIRMJkk');
    dispatch(roomActions.toggleDialog(false));
  };

  const handleCancel = () => {
    console.log('CANCEL');
    dispatch(roomActions.toggleDialog(false));
  };

  return (
    <DownloadConfirmAlert
      isOpen={isSuggestionAlertOpen}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    >
      {content}
    </DownloadConfirmAlert>
  );
};
