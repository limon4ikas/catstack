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
  const { send, dispatchSharedEvent } = useRoomContext();
  const [file, setFile] = useState<string | null>(null);
  const { isSuggestionAlertOpen, magnetUri } = useSelector(getRoomState);
  const [torrentInfo, setTorrentInfo] = useState<TorrentDownloadInfoProps>({
    timeRemaining: 0,
    peers: 0,
    uploadSpeed: 0,
    downloadSpeed: 0,
    progrees: 0,
    isLoading: false,
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
      setTorrentInfo((prev) => ({ ...prev, isLoading: true }));
      dispatchSharedEvent(
        newRoomEventMessage(`${user.username} started downloading file`)
      );

      torrent.on(
        'download',
        throttle(function () {
          const info: Partial<TorrentDownloadInfoProps> = {
            downloadSpeed: torrent.downloadSpeed,
            uploadSpeed: torrent.uploadSpeed,
            timeRemaining: torrent.timeRemaining,
            peers: torrent.numPeers,
            progrees: torrent.progress * 100,
          };

          setTorrentInfo((prev) => ({ ...prev, ...info }));
        }, 500)
      );

      torrent.on('done', function () {
        setTorrentInfo((prev) => ({ ...prev, isLoading: false }));
        toast(`${torrent.name} finished downloading`);
        dispatchSharedEvent(newRoomEventMessage(`${user.username} is ready`));
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
        <div className="grid w-full h-full place-items-center">
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
      <div className="h-full p-4">
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
