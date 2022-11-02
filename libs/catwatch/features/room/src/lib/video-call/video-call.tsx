import { useEffect, useRef } from 'react';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { useSocket } from '@catstack/catwatch/data-access';
import { ServerEvents, UserProfile } from '@catstack/catwatch/types';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CatPeer } from '@catstack/shared/rtc';

export const VideoCallContainer = () => {
  const socket = useSocket();
  const peers = useRef<Record<number, CatPeer>>();

  const handleUserJoin = (user: UserProfile) => {
    console.log(`Joined ${user}`);
  };
  const handleUserLeft = (user: UserProfile) => {
    console.log(`Left ${user}`);
  };

  useEffect(() => {
    socket.on(ServerEvents.RoomJoined, handleUserJoin);
    socket.on(ServerEvents.RoomLeft, handleUserLeft);

    return () => {
      socket.off(ServerEvents.RoomJoined, handleUserJoin);
      socket.off(ServerEvents.RoomLeft, handleUserLeft);
    };
  }, [socket]);

  return <div className="p-8 bg-white rounded-lg">Video Call Container</div>;
};
