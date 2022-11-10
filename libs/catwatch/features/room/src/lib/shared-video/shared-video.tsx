import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { throttle } from 'lodash';

import {
  newRoomEventMessage,
  newTorrentFile,
} from '@catstack/catwatch/actions';
import { ProgressBar, toast } from '@catstack/shared/vanilla';
import { useUnmount } from '@catstack/shared/hooks';
import { useAuthUser } from '@catstack/catwatch/features/auth';

import { useRoomContext } from '../context';
import { VideoPlayer } from '../video-player';
import { getRoomState } from '../room-slice.selectors';
import { roomActions } from '../room-slice';
import { DownloadConfirmAlert } from './confirm-alert';
import { CreateTorrentForm } from './create-torrent-form';
import { getRemainingTime, prettyBytes } from '@catstack/shared/utils';

export const SharedVideoContainer = () => {
  const dispatch = useDispatch();
  const user = useAuthUser();
  const { send } = useRoomContext();
  const [file, setFile] = useState<string | null>(null);
  const { isSuggestionAlertOpen, magnetUri } = useSelector(getRoomState);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState('');
  const [uploadSpeed, setUploadSpeed] = useState('');
  const [remaining, setRemainig] = useState('');

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

    client.add(magnetUri, function (torrent) {
      const roomStartDownloadMessage = newRoomEventMessage(
        `${user.username} started downloading file`
      );

      setIsDownloading(true);
      send(roomStartDownloadMessage);
      dispatch(roomStartDownloadMessage);

      torrent.on(
        'download',
        throttle(function () {
          setDownloadProgress(torrent.progress * 100);
          setDownloadSpeed(prettyBytes(torrent.downloadSpeed));
          setUploadSpeed(prettyBytes(torrent.uploadSpeed));
          setRemainig(getRemainingTime(torrent.timeRemaining, torrent.done));
        }, 500)
      );

      torrent.on('done', function () {
        const readyAction = newRoomEventMessage(`${user.username} is ready`);

        setIsDownloading(false);
        toast(`${torrent.name} finished downloading`);
        send(readyAction);
        dispatch(readyAction);
      });

      const movie = torrent.files.find((file) => file.name.endsWith('.mp4'));

      if (!movie) return;

      movie.getBlobURL(function (err, url) {
        if (err) throw err;
        if (!url) throw new Error('No Url');
        // downloadFile(`${torrent.name}`, url);
        setFile(url);
      });
    });
  };

  const handleCancel = () => dispatch(roomActions.toggleDialog(false));

  const renderContent = () => {
    if (isDownloading) {
      return (
        <div className="w-full h-full grid place-items-center">
          <h1 className="dark:text-white">Loading file...</h1>
          <h1 className="dark:text-white">Download Speed: {downloadSpeed}</h1>
          <h1 className="dark:text-white">Upload Speed: {uploadSpeed}</h1>
          <h1 className="dark:text-white">Time remainig: {remaining}</h1>
        </div>
      );
    }

    if (file) return <VideoPlayer file={file} />;

    return (
      <div className="p-4 h-full">
        <CreateTorrentForm onCreatedTorrent={handleCreatedTorrent} />;
      </div>
    );
  };

  return (
    <div className="relative h-full">
      <div className="absolute top-0 left-0 w-full">
        {isDownloading && <ProgressBar value={downloadProgress} max={100} />}
      </div>

      <DownloadConfirmAlert
        isOpen={isSuggestionAlertOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      >
        <div className="w-full h-full">{renderContent()}</div>
      </DownloadConfirmAlert>
    </div>
  );
};
