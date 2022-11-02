import { useState } from 'react';

import { CreateTorrentForm } from '../create-torrent-form';
import { AddTorrentFileForm } from '../download-torrent-form';

export const TorrentManagerContainer = () => {
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

  return (
    <div className="flex flex-col gap-6">
      <CreateTorrentForm onCreatedTorrent={handleCreatedTorrent} />
      <AddTorrentFileForm
        magnetUri={magnetURI}
        onTorrentDownloadComplete={handleTorrentDownloadComplete}
        onTorrentProgress={handleTorrentProgress}
        onMagnetUriChange={setMagnetUri}
      />
    </div>
  );
};
