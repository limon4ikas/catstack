import { useState } from 'react';

import { toast } from '@catstack/shared/vanilla';

import { AddTorrentFileForm } from '../download-torrent-form';

export const TorrentManagerContainer = () => {
  const [magnetURI, setMagnetUri] = useState('');

  const handleTorrentDownloadComplete = (name: string, blobUrl: string) => {
    toast(`Downloaded torrent ${name}`);
    console.log(blobUrl);
  };

  const handleTorrentProgress = (progress: number) => {
    console.log(`progress: ${progress}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <AddTorrentFileForm
        magnetUri={magnetURI}
        onTorrentDownloadComplete={handleTorrentDownloadComplete}
        onTorrentProgress={handleTorrentProgress}
        onMagnetUriChange={setMagnetUri}
      />
    </div>
  );
};
