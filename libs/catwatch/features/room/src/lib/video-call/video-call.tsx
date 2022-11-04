import { SyntheticEvent, useEffect, useRef } from 'react';
import { throttle } from 'lodash';

import { useRoomContext } from '../context';
import { getVideoPlayerState, roomActions } from '../room-slice';
import { useSelector } from 'react-redux';
import { selectUserId } from '@catstack/catwatch/features/auth';

const useVideoSync = () => {
  const { send } = useRoomContext();
  const ref = useRef<HTMLVideoElement>(null);
  const { seek, videoState } = useSelector(getVideoPlayerState);
  const userId = useSelector(selectUserId);

  const handlePause = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoEl = ref.current;
    if (!videoEl) return;

    if (userId === 1) send(roomActions.pause(videoEl.currentTime));
  };

  const handlePlay = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoEl = ref.current;
    if (!videoEl) return;

    if (userId === 1) send(roomActions.play(videoEl.currentTime));
  };

  const handleSeeked = throttle(
    (e: SyntheticEvent<HTMLVideoElement, Event>) => {
      const videoEl = ref.current;
      if (!videoEl) return;

      if (userId === 1) send(roomActions.seek(videoEl.currentTime));
    },
    500
  );

  const listeners = {
    onPlay: handlePlay,
    onPause: handlePause,
    onSeeked: handleSeeked,
  };

  useEffect(() => {
    const videoEl = ref.current;

    if (!videoEl) return;

    if (seek) videoEl.currentTime = seek;
    if (videoState === 'play') videoEl.play();
    if (videoState === 'pause') videoEl.pause();
  }, [seek, videoState]);

  return { ref, listeners };
};

export interface VideoCallContainerProps {
  roomId: string;
  file: string;
}

export const VideoCallContainer = ({
  roomId,
  file,
}: VideoCallContainerProps) => {
  const { ref, listeners } = useVideoSync();

  return (
    <div className="w-full h-full">
      <video
        controls
        className="h-full rounded-lg"
        src={file}
        muted
        autoPlay
        key={'1'}
        {...listeners}
        ref={ref}
      />
    </div>
  );
};
