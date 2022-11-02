import { Dispatch, SetStateAction, useState } from 'react';

import { Button, Input } from '@catstack/shared/vanilla';

export interface ProgressBarProps {
  progress?: number;
}

const ProgressBar = ({ progress = 0 }: ProgressBarProps) => {
  return (
    <div>
      <h1>{progress.toFixed(2)}%</h1>
      <div
        className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export interface AddTorrentFileFormProps {
  magnetUri: string;
  onTorrentDownloadComplete: (url: string) => void;
  onTorrentProgress: (progress: number) => void;
  onMagnetUriChange: Dispatch<SetStateAction<string>>;
}

export const AddTorrentFileForm = ({
  magnetUri,
  onTorrentDownloadComplete,
  onMagnetUriChange,
}: AddTorrentFileFormProps) => {
  const [progress, setProgress] = useState(0);

  const handleDownloadClick = async () => {
    const WebTorrent = (await import('webtorrent')).default;
    const client = new WebTorrent();

    if (!magnetUri) return;

    client.add(magnetUri, function (torrent) {
      torrent.on('download', function () {
        // onTorrentProgress(torrent.progress);
        setProgress(torrent.progress * 100);
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
    <div className="flex flex-col gap-6">
      <Input
        label="Magnet URI to download"
        placeholder="Magnet URI"
        type="text"
        value={magnetUri}
        onChange={(e) => onMagnetUriChange(e.target.value)}
      />
      <Button onClick={handleDownloadClick}>Download</Button>
      <ProgressBar progress={progress} />
    </div>
  );
};
