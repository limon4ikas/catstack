/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useCallback, useEffect, useRef } from 'react';
import Peer, { SignalData } from 'simple-peer';

import { useUserMedia } from '@catstack/shared/hooks';
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
import { handlePeerConnection, handlerError } from '@catstack/shared/rtc';

export const SERVERS: RTCConfiguration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

export interface VideoCallContainerProps {
  roomId: string;
}

export const VideoCallContainer = ({ roomId }: VideoCallContainerProps) => {
  const socket = useSocket();
  const { id: userId } = useAppSelector(selectUser) as UserProfile;
  const peersRef = useRef<Record<string, Peer.Instance>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  const { getMedia } = useUserMedia();

  const createInitiatorPeer = useCallback(
    async (callerId: number, calleeId: number) => {
      console.log(
        `⚡️ Initiate peer connection to from ${calleeId} to ${calleeId}`
      );
      const stream = await getMedia({ video: true });
      const pc = new Peer({
        initiator: true,
        trickle: false,
        config: SERVERS,
        stream,
      });
      pc.on('signal', (signal) => {
        socket.emit(Events.SendingSignal, {
          toUserId: calleeId,
          fromUserId: callerId,
          signal,
        });
      });

      pc.on('stream', (stream) => {
        console.log('Got remote stream', stream);
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
      });
      pc.on('connect', handlePeerConnection('Initiator'));
      pc.on('error', handlerError);
      return pc;
    },
    [getMedia, socket]
  );

  const createListenerPeer = useCallback(
    async (incomingSignal: SignalData, callerId: number) => {
      console.log(`⚡️ Waiting for peer connection from ${callerId}`);
      const stream = await getMedia({ video: true });

      const pc = new Peer({
        initiator: false,
        trickle: false,
        config: SERVERS,
        stream,
      });

      pc.on('signal', (signal) => {
        socket.emit(Events.ReturningSignal, {
          toUserId: callerId,
          fromUserId: userId,
          signal,
        });
      });
      pc.on('stream', (stream) => {
        console.log('Got remote stream', stream);
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
      });
      pc.on('error', handlerError);
      pc.on('connect', handlePeerConnection('Listener'));
      pc.signal(incomingSignal);

      return pc;
    },
    [getMedia, socket, userId]
  );

  const handleAllUsersEvent = useCallback(
    (users: UserProfile[]) => {
      const peers = peersRef.current;

      const createConnection = async (user: UserProfile) => {
        if (user.id === userId || peers[user.id]) {
          console.log('⚡️ Skipping connection');
          return;
        }
        const peer = await createInitiatorPeer(userId, user.id);

        peers[user.id] = peer;
      };

      if (!users.length) {
        console.log('⚡️ No one in the room waiting for participants');
      }

      users.forEach(createConnection);
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

  const destroyConnection = useCallback(
    (leftUserId: string | UserProfile) => {
      const peers = peersRef.current;

      if (typeof leftUserId !== 'string') {
        console.log(
          `⚡️ Destroy connection from ${userId} to ${leftUserId.id}`
        );

        if (!peers[leftUserId.id]) {
          console.warn('⚡️ No connection for this user, please check');
        }
        peers[leftUserId.id].destroy();
        return;
      }

      console.log(`⚡️ Destroy connection from ${userId} to ${leftUserId}`);

      if (!peers[leftUserId]) {
        console.warn('⚡️ No connection for this user, please check');
      }

      peers[leftUserId].destroy();
    },
    [userId]
  );

  const destroyPeers = useCallback(() => {
    const peers = peersRef.current;

    Object.keys(peers).forEach(destroyConnection);
  }, [destroyConnection]);

  useEffect(() => {
    (async () => {
      socket.emit(ClientEvents.JoinRoom, roomId);
      socket.on(Events.AllUsers, handleAllUsersEvent);
      socket.on(ServerEvents.RoomJoined, handleRoomJoinedEvent);
      socket.on(Events.RecievingReturnedSignal, handleRecievingReturnedSignal);
      socket.on(ServerEvents.onRoomLeft, destroyConnection);
    })();

    return () => {
      socket.emit(ClientEvents.LeaveRoom, roomId);
      socket.off(Events.AllUsers, handleAllUsersEvent);
      socket.off(ServerEvents.RoomJoined, handleRoomJoinedEvent);
      socket.off(Events.RecievingReturnedSignal, handleRecievingReturnedSignal);
      socket.off(ServerEvents.onRoomLeft, destroyConnection);

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
    destroyConnection,
  ]);

  return (
    <div className="p-8 bg-white rounded-lg">
      <video ref={videoRef} autoPlay controls />
    </div>
  );
};
