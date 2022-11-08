import { SyntheticEvent, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { throttle } from 'lodash';

import { useAuth } from '@catstack/catwatch/features/auth';

import { useRoomContext } from '../context';
import { roomActions, VideoPlayerActionPayload } from '../room-slice';
import { getVideoPlayerState } from '../room-slice.selectors';

const useVideoSync = () => {
  const dispatch = useDispatch();
  const { seek, videoState, eventFrom } = useSelector(getVideoPlayerState);
  const { username } = useAuth();
  const { send } = useRoomContext();
  const videoRef = useRef<HTMLVideoElement>(null);

  const getVideo = useCallback(() => {
    return new Promise<HTMLVideoElement>((resolve, reject) => {
      const videoEl = videoRef.current;
      if (!videoEl) return reject();
      resolve(videoEl);
    });
  }, []);

  /**
  |--------------------------------------------------
  | ACTIONS
  |--------------------------------------------------
  */

  const handlePlayerAction =
    (playerAction: ActionCreatorWithPayload<VideoPlayerActionPayload>) =>
    (video: HTMLVideoElement) => {
      const payload = { time: video.currentTime, eventFrom: username };
      const action = playerAction(payload);

      if (eventFrom !== username) return dispatch(action);

      return send(action);
    };

  const handlePlay = async (_: SyntheticEvent<HTMLVideoElement, Event>) => {
    getVideo().then(handlePlayerAction(roomActions.play));
  };

  const handlePause = async (_: SyntheticEvent<HTMLVideoElement, Event>) => {
    getVideo().then(handlePlayerAction(roomActions.pause));
  };

  const handleSeeked = throttle(
    async (_: SyntheticEvent<HTMLVideoElement, Event>) => {
      getVideo().then(handlePlayerAction(roomActions.seek));
    },
    500
  );

  /**
  |--------------------------------------------------
  | SYNC
  |--------------------------------------------------
  */

  const isSeekLocked = useRef(false);
  useEffect(() => {
    const handleSeek = async () => {
      const videoEl = await getVideo();
      if (eventFrom === username) return;

      if (seek) {
        videoEl.currentTime = seek;
        isSeekLocked.current = true;
      }
    };

    handleSeek();
  }, [eventFrom, getVideo, seek, username]);

  useEffect(() => {
    const handlePlayPauseSync = async () => {
      const videoEl = await getVideo();
      if (eventFrom === username) return;

      if (videoState === 'play') videoEl.play();
      if (videoState === 'pause') videoEl.pause();
    };

    handlePlayPauseSync();
  }, [eventFrom, getVideo, username, videoState]);

  const listeners = {
    onPlay: handlePlay,
    onPause: handlePause,
    onSeeked: handleSeeked,
    onSeekedCapture: (e: SyntheticEvent<HTMLVideoElement, Event>) => {
      if (isSeekLocked.current) e.stopPropagation();
      isSeekLocked.current = false;
    },
  };

  return { ref: videoRef, listeners };
};

export interface VideoCallContainerProps {
  file: string;
}

export const VideoPlayer = ({ file }: VideoCallContainerProps) => {
  const { ref, listeners } = useVideoSync();

  return (
    <div className="w-full h-full bg-black rounded-lg">
      <video
        id="video-player"
        controls
        className="h-full rounded-[inherit]"
        src={file}
        muted
        autoPlay
        {...listeners}
        ref={ref}
      />
    </div>
  );
};
