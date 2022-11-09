import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { newTorrentFile } from '@catstack/catwatch/actions';
import { ProgressBar, toast } from '@catstack/shared/vanilla';
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
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleCreatedTorrent = async (
    torrentName: string,
    magnetUri: string,
    file: File
  ) => {
    toast(`Seeding torrent ${torrentName}`);
    send(newTorrentFile({ magnetUri, user }));
    setFile(URL.createObjectURL(file));
  };

  useEffect(() => () => {
    if (!file) return;
    URL.revokeObjectURL(file);
    setFile(null);
  });

  const handleConfirm = async () => {
    dispatch(roomActions.toggleDialog(false));

    if (!magnetUri) return;

    const WebTorrent = (await import('webtorrent')).default;
    const client = new WebTorrent();

    client.add(magnetUri, function(torrent) {
      torrent.on('download', function() {
        setDownloadProgress(torrent.progress * 100);
      });

      const movie = torrent.files.find((file) => file.name.endsWith('.mp4'));

      if (!movie) return;

      movie.getBlobURL(function(err, url) {
        if (err) throw err;
        if (!url) throw new Error('No Url');
        setFile(url);
      });
    });
  };

  const handleCancel = () => dispatch(roomActions.toggleDialog(false));

  return (
    <div className="relative p-4 w-full h-full">
      <div className="absolute top-0 left-0 w-full">
        <ProgressBar value={downloadProgress} max={100} />
      </div>

      <DownloadConfirmAlert
        isOpen={isSuggestionAlertOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      >
        {file ? (
          <VideoPlayer file={file} />
        ) : (
          <CreateTorrentForm onCreatedTorrent={handleCreatedTorrent} />
        )}
      </DownloadConfirmAlert>
    </div>
  );
};
