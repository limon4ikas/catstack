import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { throttle } from 'lodash';

import {
  newRoomEventMessage,
  newTorrentFile,
} from '@catstack/catwatch/actions';
import { ProgressBar, toast } from '@catstack/shared/vanilla';
import { useUnmount } from '@catstack/shared/hooks';
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
  const [isDownloading, setIsDownloading] = useState(false);

  useUnmount(() => {
    if (file) URL.revokeObjectURL(file);
  });

  const handleCreatedTorrent = async (
    torrentName: string,
    magnetUri: string,
    file: File
  ) => {
    toast(`Seeding torrent ${torrentName}`);
    send(newTorrentFile({ magnetUri, user }));
    setFile(URL.createObjectURL(file));
  };

  const handleConfirm = async () => {
    dispatch(roomActions.toggleDialog(false));

    if (!magnetUri) return;

    const WebTorrent = (await import('webtorrent')).default;
    const client = new WebTorrent();

    client.add(magnetUri, function(torrent) {
      setIsDownloading(true);

      torrent.on(
        'download',
        throttle(function() {
          setDownloadProgress(torrent.progress * 100);
        }, 500)
      );

      torrent.on('done', function() {
        const readyAction = newRoomEventMessage(`${user.username} is ready`);

        setIsDownloading(false);
        toast(`${torrent.name} finished downloading`);
        send(readyAction);
        dispatch(readyAction);
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
        {isDownloading && <ProgressBar value={downloadProgress} max={100} />}
      </div>

      <DownloadConfirmAlert
        isOpen={isSuggestionAlertOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      >
        <div className="w-full h-full">
          {file ? (
            <VideoPlayer file={file} />
          ) : (
            <CreateTorrentForm onCreatedTorrent={handleCreatedTorrent} />
          )}
        </div>
      </DownloadConfirmAlert>
    </div>
  );
};
