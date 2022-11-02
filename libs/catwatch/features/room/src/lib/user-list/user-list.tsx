import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

import { UserProfile } from '@catstack/catwatch/types';
import { Button, Input, toast } from '@catstack/shared/vanilla';

import WebTorrent from 'webtorrent';

import { useRoom } from '../hooks/use-room';

const client = new WebTorrent();

export interface UserListProps {
  users: UserProfile[];
}

export const UserList = (props: UserListProps) => {
  return (
    <ul className="flex flex-col gap-4">
      {props.users.map((user) => (
        <li key={user.id}>{user.username}</li>
      ))}
    </ul>
  );
};

export interface UsersListContainerProps {
  roomId: string;
}

export const UsersListContainer = ({ roomId }: UsersListContainerProps) => {
  const { user, users, isLoading, isError } = useRoom({ roomId });
  const [magnetURI, setMagnetUri] = useState('');

  const handleCreatedTorrent = (magnetUri: string) => {
    console.log(magnetUri);
  };

  const handleTorrentDownloadComplete = (blobUrl: string) => {
    console.log(blobUrl);
  };

  const handleTorrentProgress = (progress: number) => {
    console.log(`progress: ${progress}`);
  };

  if (isError) return <h1>Something went wrong</h1>;

  if (isLoading) return <h1>Loading</h1>;

  if (!users.length) return <h1>No users</h1>;

  return (
    <div>
      <video id="stream" controls autoPlay />
      <h1 style={{ fontWeight: 600 }}>Logged in as {user.username}</h1>
      <UserList users={users} />
      <SeedFileForm onCreatedTorrent={handleCreatedTorrent} />
      {magnetURI && (
        <AddTorrentFileForm
          magnetUri={magnetURI}
          onTorrentDownloadComplete={handleTorrentDownloadComplete}
          onTorrentProgress={handleTorrentProgress}
          onMagnetUriChange={setMagnetUri}
        />
      )}
    </div>
  );
};

export interface AddTorrentFileFormProps {
  magnetUri: string;
  onTorrentDownloadComplete: (url: string) => void;
  onTorrentProgress: (progress: number) => void;
  onMagnetUriChange: Dispatch<SetStateAction<string>>;
}

const AddTorrentFileForm = ({
  magnetUri,
  onTorrentDownloadComplete,
  onTorrentProgress,
  onMagnetUriChange,
}: AddTorrentFileFormProps) => {
  const handleDownloadClick = () => {
    client.add(magnetUri, function (torrent) {
      torrent.on('download', function () {
        onTorrentProgress(torrent.progress);
      });

      const movie = torrent.files.find((file) => file.name.endsWith('.mp4'));

      if (!movie) return;

      movie.getBlobURL(function (err, url) {
        if (err) throw err;
        if (!url) throw new Error('No Url');
        onTorrentDownloadComplete(url);
      });
    });
  };

  return (
    <div>
      <Input
        type="text"
        value={magnetUri}
        onChange={(e) => onMagnetUriChange(e.target.value)}
      />
      <Button onClick={handleDownloadClick}>Download</Button>
    </div>
  );
};

export interface SeedFileFormProps {
  onCreatedTorrent: (magnetUri: string) => void;
}

const SeedFileForm = (props: SeedFileFormProps) => {
  const [magnetURI, setMagnet] = useState('');

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const eventFile = e.target.files?.item(0);
    if (!eventFile) return;
    client.seed(eventFile, (torrent) => {
      toast(`Seeding torrent ${torrent.name}`);
      setMagnet(torrent.magnetURI);
      props.onCreatedTorrent(torrent.magnetURI);
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <Input
        type="text"
        onChange={(e) => setMagnet(e.target.value)}
        value={magnetURI}
      />
    </div>
  );
};
