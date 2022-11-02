import { useState, ChangeEvent } from 'react';

import { Input, toast } from '@catstack/shared/vanilla';

export interface SeedFileFormProps {
  onCreatedTorrent: (magnetUri: string) => void;
}

export const CreateTorrentForm = ({ onCreatedTorrent }: SeedFileFormProps) => {
  const [magnetURI, setMagnet] = useState('');

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const WebTorrent = (await import('webtorrent')).default;

    const client = new WebTorrent();

    const eventFile = e.target.files?.item(0);

    if (!eventFile) return;

    client.seed(eventFile, function (torrent) {
      toast(`Seeding torrent ${torrent.name}`);
      setMagnet(torrent.magnetURI);
      console.log(torrent.magnetURI);
      onCreatedTorrent(torrent.magnetURI);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <input type="file" onChange={handleFileChange} />
      <Input
        label="Created magnet URI"
        type="text"
        onChange={(e) => setMagnet(e.target.value)}
        value={magnetURI}
      />
    </div>
  );
};
