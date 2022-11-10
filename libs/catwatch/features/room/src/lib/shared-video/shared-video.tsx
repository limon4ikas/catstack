import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { throttle } from 'lodash';

import {
  newRoomEventMessage,
  newTorrentFile,
} from '@catstack/catwatch/actions';
import {
  ProgressBar,
  toast,
  TorrenDownloadInfo,
  TorrentDownloadInfoProps,
} from '@catstack/shared/vanilla';
import { useUnmount } from '@catstack/shared/hooks';
import { useAuthUser } from '@catstack/catwatch/features/auth';

import { useRoomContext } from '../context';
import { VideoPlayer } from '../video-player';
import { getRoomState } from '../room-slice.selectors';
import { roomActions } from '../room-slice';
import { DownloadConfirmAlert } from './confirm-alert';
import { CreateTorrentForm } from './create-torrent-form';

export const SharedVideoContainer = () => {
  const dispatch = useDispatch();
  const user = useAuthUser();
  const { send } = useRoomContext();
  const [file, setFile] = useState<string | null>(null);
  const { isSuggestionAlertOpen, magnetUri } = useSelector(getRoomState);
  const [torrentInfo, setTorrentInfo] = useState<TorrentDownloadInfoProps>({
    timeRemaining: 0,
    peers: 0,
    uploadSpeed: 0,
    downloadSpeed: 0,
    isLoading: false,
    progrees: 0,
  });

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

      setTorrentInfo((prev) => ({ ...prev, isLoading: true }));
      send(roomStartDownloadMessage);
      dispatch(roomStartDownloadMessage);

      torrent.on(
        'download',
        throttle(function () {
          const info: TorrentDownloadInfoProps = {
            downloadSpeed: torrent.downloadSpeed,
            uploadSpeed: torrent.uploadSpeed,
            timeRemaining: torrent.timeRemaining,
            peers: torrent.numPeers,
            progrees: torrent.progress * 100,
            isLoading: true,
          };

          setTorrentInfo(info);
        }, 500)
      );

      torrent.on('done', function () {
        const readyAction = newRoomEventMessage(`${user.username} is ready`);

        setTorrentInfo((prev) => ({ ...prev, isLoading: false }));
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
    if (torrentInfo.isLoading) {
      return (
        <div className="w-full h-full grid place-items-center">
          <TorrenDownloadInfo
            downloadSpeed={torrentInfo.downloadSpeed}
            uploadSpeed={torrentInfo.uploadSpeed}
            timeRemaining={torrentInfo.timeRemaining}
            peers={torrentInfo.peers}
            isLoading={torrentInfo.isLoading}
            progrees={torrentInfo.progrees}
          />
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
        {torrentInfo.isLoading && (
          <ProgressBar value={torrentInfo.progrees} max={100} />
        )}
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
