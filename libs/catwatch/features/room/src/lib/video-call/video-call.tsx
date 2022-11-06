import { SyntheticEvent, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { throttle } from 'lodash';

import { useRoomContext } from '../context';
import { getVideoPlayerState, roomActions } from '../room-slice';

const useVideoSync = () => {
  const { send } = useRoomContext();
  const ref = useRef<HTMLVideoElement>(null);
  const { seek, videoState } = useSelector(getVideoPlayerState);
  const ignoreRef = useRef(false);

  const handlePause = (_: SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoEl = ref.current;
    if (!videoEl || ignoreRef.current) return;
    const time = videoEl.currentTime;

    send(roomActions.pause(time));
    ignoreRef.current = false;
  };

  const handlePlay = (_: SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoEl = ref.current;
    if (!videoEl || ignoreRef.current) return;
    const time = videoEl.currentTime;

    send(roomActions.play(time));
    ignoreRef.current = false;
  };

  const handleSeeked = throttle(
    (_: SyntheticEvent<HTMLVideoElement, Event>) => {
      const videoEl = ref.current;
      if (!videoEl || ignoreRef.current) return;
      const time = videoEl.currentTime;

      send(roomActions.seek(time));
      ignoreRef.current = false;
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
    ignoreRef.current = true;

    if (!videoEl) return;

    if (seek) videoEl.currentTime = seek;
    if (videoState === 'play') videoEl.play();
    if (videoState === 'pause') videoEl.pause();
  }, [seek, videoState]);

  return { ref, listeners };
};

export interface VideoCallContainerProps {
  file: string;
}

export const VideoPlayer = ({ file }: VideoCallContainerProps) => {
  const { ref, listeners } = useVideoSync();

  return (
    <div className="w-full h-full">
      <video
        controls
        className="h-full rounded-lg"
        src={file}
        muted
        autoPlay
        {...listeners}
        ref={ref}
      />
    </div>
  );
};
