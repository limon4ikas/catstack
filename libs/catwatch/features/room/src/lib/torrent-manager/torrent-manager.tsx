import { useState } from 'react';

import { useCopyToClipboard } from '@catstack/shared/hooks';
import { toast } from '@catstack/shared/vanilla';

import { CreateTorrentForm } from '../create-torrent-form';
import { AddTorrentFileForm } from '../download-torrent-form';

export const TorrentManagerContainer = () => {
  const [magnetURI, setMagnetUri] = useState('');
  const { copy } = useCopyToClipboard();

  const handleCreatedTorrent = async (magnetUri: string) => {
    await copy(magnetUri);
    toast('Copied magnet uri to clipboard!');
  };

  const handleTorrentDownloadComplete = (name: string, blobUrl: string) => {
    toast(`Downloaded torrent ${name}`);
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
