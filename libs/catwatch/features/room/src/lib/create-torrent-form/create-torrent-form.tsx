import { FileDropZone } from '@catstack/shared/vanilla';

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
