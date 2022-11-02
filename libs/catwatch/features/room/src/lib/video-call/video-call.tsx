/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useCallback, useEffect, useRef } from 'react';
import Peer from 'simple-peer';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { useSocket } from '@catstack/catwatch/data-access';
import {
  ClientEvents,
  Events,
  ServerEvents,
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

  const createInitiatorPeer = useCallback(
    (callerId: number, calleeId: number, stream: MediaStream) => {
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
    [socket]
  );

  const createListenerPeer = useCallback(
    (
      incomingSignal: Peer.SignalData,
      callerId: number,
      stream: MediaStream
    ) => {
      console.log(`⚡️ Waiting for peer connection from ${callerId}`);
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
    [socket, userId]
  );

  useEffect(() => {
    const peers = peersRef.current;

    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      socket.emit(ClientEvents.JoinRoom, roomId);

      socket.on(Events.AllUsers, (users) => {
        console.log('⚡️ Got all users from server on join', users);

        if (!users.length) {
          console.log('⚡️ No one in the room waiting for participants');
        }
        users.forEach((user) => {
          if (user.id === userId || peers[user.id]) {
            console.log('⚡️ Skipping connection');
            return;
          }
          const peer = createInitiatorPeer(userId, user.id, stream);
          console.log(
            `⚡️ Initiate peer connection to from ${userId} to ${user.id}`
          );
          peers[user.id] = peer;
        });
      });

      socket.on(ServerEvents.RoomJoined, (payload) => {
        console.log('⚡️ User joined creating listener peer');

        const peer = createListenerPeer(
          payload.signal,
          payload.fromUserId,
          stream
        );
        peers[payload.fromUserId] = peer;
      });

      socket.on(Events.RecievingReturnedSignal, (message) => {
        peers[message.fromUserId]?.signal(message.signal);
      });
    })();

    return () => {
      socket.emit(ClientEvents.LeaveRoom, roomId);
    };
  }, [createInitiatorPeer, createListenerPeer, roomId, socket, userId]);

  return (
    <div className="p-8 bg-white rounded-lg">
      <video ref={videoRef} autoPlay controls />
    </div>
  );
};
