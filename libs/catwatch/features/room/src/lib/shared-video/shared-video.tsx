import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { newTorrentFile } from '@catstack/catwatch/actions';
import { toast, FileDropZone } from '@catstack/shared/vanilla';
import { useAuth } from '@catstack/catwatch/features/auth';

import { useRoomContext } from '../context';
import { VideoPlayer } from '../video-player';
import { getUsersWithConnections } from '../room-slice.selectors';

export interface SeedFileFormProps {
  onCreatedTorrent: (name: string, magnetUri: string, file: File) => void;
}

export const CreateTorrentForm = ({ onCreatedTorrent }: SeedFileFormProps) => {
  const handleFileChange = async (file: File) => {
    const WebTorrent = (await import('webtorrent')).default;
    const client = new WebTorrent();
    onCreatedTorrent('', '', file);
    // client.seed(file, function (torrent) {
    // });
  };

  return <FileDropZone onFileDrop={handleFileChange} />;
};

export const SharedVideoContainer = () => {
  const [file, setFile] = useState<string | null>(null);
  const { send } = useRoomContext();
  const user = useAuth();
  const users = useSelector(getUsersWithConnections(user.id));

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

  if (!file) {
    return <CreateTorrentForm onCreatedTorrent={handleCreatedTorrent} />;
  }

  return <VideoPlayer file={file} />;
};
