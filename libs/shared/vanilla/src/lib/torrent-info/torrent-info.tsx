import { getRemainingTime, prettyBytes } from '@catstack/shared/utils';

export interface TorrentDownloadInfoProps {
  downloadSpeed: number;
  uploadSpeed: number;
  timeRemaining: number;
  peers: number;
  isLoading: boolean;
  progrees: number;
}

export const TorrenDownloadInfo = (props: TorrentDownloadInfoProps) => {
  const { peers, timeRemaining, uploadSpeed, downloadSpeed } = props;

  const formattedDownloadSpeed = prettyBytes(downloadSpeed);
  const formattedUploadSpeed = prettyBytes(uploadSpeed);
  const formattedRemainingTime = getRemainingTime(timeRemaining);
  const formattedPeers = peers;

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 rounded-xl p-4">
      <span className="dark:text-white text-gray-700">
        Time remainig: {formattedRemainingTime}
      </span>
      <span className="dark:text-white text-gray-700">
        Download: {formattedDownloadSpeed}
      </span>
      <span className="dark:text-white text-gray-700">
        Upload: {formattedUploadSpeed}
      </span>
      <span className="dark:text-white text-gray-700">
        Peers: {formattedPeers}
      </span>
    </div>
  );
};
