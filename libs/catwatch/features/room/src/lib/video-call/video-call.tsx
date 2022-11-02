/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useCallback, useEffect, useRef } from 'react';
import Peer from 'simple-peer';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { useSocket } from '@catstack/catwatch/data-access';
import {
  ClientEvents,
  Events,
  ServerEvents,
  SignalMessage,
  UserProfile,
} from '@catstack/catwatch/types';

import { useAppSelector } from '@catstack/catwatch/store';
import { selectUser } from '@catstack/catwatch/features/auth';

export const SERVERS: RTCConfiguration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

const useUserMedia = () => {
  const getMedia = useCallback(async (constraints?: MediaStreamConstraints) => {
    return await navigator.mediaDevices.getUserMedia(constraints);
  }, []);

  return { getMedia };
};

const handlePeerConnection = (label: string) => () => {
  console.log(`⚡️ ${label} from connection established`);
};

const handlerError = (error: Error) => {
  console.warn(error.name, error.message);
};

export interface VideoCallContainerProps {
  roomId: string;
}

export const VideoCallContainer = ({ roomId }: VideoCallContainerProps) => {
  const socket = useSocket();
  const { id: userId } = useAppSelector(selectUser) as UserProfile;
  const peersRef = useRef<Record<number, Peer.Instance>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  const { getMedia } = useUserMedia();

  const createInitiatorPeer = useCallback(
    async (callerId: number, calleeId: number) => {
      const stream = await getMedia({ video: true });
      const peer = new Peer({
        initiator: true,
        trickle: false,
        config: SERVERS,
        stream,
      });
      peer.on('signal', (signal) => {
        socket.emit(Events.SendingSignal, {
          toUserId: calleeId,
          fromUserId: callerId,
          signal,
        });
      });

      peer.on('stream', (stream) => {
        console.log('Got remote stream', stream);
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
      });
      peer.on('connect', handlePeerConnection('Initiator'));
      peer.on('error', handlerError);
      return peer;
    },
    [getMedia, socket]
  );

  const createListenerPeer = useCallback(
    async (incomingSignal: Peer.SignalData, callerId: number) => {
      console.log(`⚡️ Waiting for peer connection from ${callerId}`);
      const stream = await getMedia({ video: true });

      const peer = new Peer({
        initiator: false,
        trickle: false,
        config: SERVERS,
        stream,
      });

      peer.on('signal', (signal) => {
        socket.emit(Events.ReturningSignal, {
          toUserId: callerId,
          fromUserId: userId,
          signal,
        });
      });
      peer.on('stream', (stream) => {
        console.log('Got remote stream', stream);
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
      });
      peer.on('error', handlerError);
      peer.on('connect', handlePeerConnection('Listener'));
      peer.signal(incomingSignal);

      return peer;
    },
    [getMedia, socket, userId]
  );

  const handleAllUsersEvent = useCallback(
    (users: UserProfile[]) => {
      const peers = peersRef.current;

      console.log('⚡️ Got all users from server on join', users);

      if (!users.length) {
        console.log('⚡️ No one in the room waiting for participants');
      }
      users.forEach(async (user) => {
        if (user.id === userId || peers[user.id]) {
          console.log('⚡️ Skipping connection');
          return;
        }
        const peer = await createInitiatorPeer(userId, user.id);
        console.log(
          `⚡️ Initiate peer connection to from ${userId} to ${user.id}`
        );
        peers[user.id] = peer;
      });
    },
    [createInitiatorPeer, userId]
  );

  const handleRoomJoinedEvent = useCallback(
    async (message: SignalMessage) => {
      const peers = peersRef.current;
      console.log('⚡️ User joined creating listener peer');

      const peer = await createListenerPeer(message.signal, message.fromUserId);
      peers[message.fromUserId] = peer;
    },
    [createListenerPeer]
  );

  const handleRecievingReturnedSignal = (message: SignalMessage) => {
    const peers = peersRef.current;

    peers[message.fromUserId]?.signal(message.signal);
  };

  const destroyPeers = useCallback(() => {
    const peers = peersRef.current;

    Object.entries(peers).forEach(([id, peer]) => {
      console.log(`⚡️ Destroy connection from ${userId} to ${id}`);
      peer.destroy();
    });
  }, [userId]);

  useEffect(() => {
    (async () => {
      socket.emit(ClientEvents.JoinRoom, roomId);
      socket.on(Events.AllUsers, handleAllUsersEvent);
      socket.on(ServerEvents.RoomJoined, handleRoomJoinedEvent);
      socket.on(Events.RecievingReturnedSignal, handleRecievingReturnedSignal);
    })();

    return () => {
      socket.emit(ClientEvents.LeaveRoom, roomId);
      socket.off(Events.AllUsers, handleAllUsersEvent);
      socket.off(ServerEvents.RoomJoined, handleRoomJoinedEvent);
      socket.off(Events.RecievingReturnedSignal, handleRecievingReturnedSignal);
      destroyPeers();
    };
  }, [
    roomId,
    userId,
    socket,
    createInitiatorPeer,
    createListenerPeer,
    getMedia,
    handleAllUsersEvent,
    handleRoomJoinedEvent,
    destroyPeers,
  ]);

  return (
    <div className="p-8 bg-white rounded-lg">
      <video ref={videoRef} autoPlay controls />
    </div>
  );
};
