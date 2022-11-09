import { forwardRef } from 'react';

import { FileDropZone } from '@catstack/shared/vanilla';

export interface SeedFileFormProps {
  onCreatedTorrent: (name: string, magnetUri: string, file: File) => void;
}

export const CreateTorrentForm = forwardRef<HTMLDivElement, SeedFileFormProps>(
  ({ onCreatedTorrent }, ref) => {
    const handleFileChange = async (file: File) => {
      const WebTorrent = (await import('webtorrent')).default;
      const client = new WebTorrent();

      client.seed(file, function(torrent) {
        onCreatedTorrent(torrent.name, torrent.magnetURI, file);
      });
    };

    return <FileDropZone onFileDrop={handleFileChange} ref={ref} />;
  }
);
