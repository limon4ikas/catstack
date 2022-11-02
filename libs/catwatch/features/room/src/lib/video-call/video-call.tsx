/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useCallback, useEffect, useRef } from 'react';

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { useSocket } from '@catstack/catwatch/data-access';
import {
  ClientEvents,
  Events,
  ServerEvents,
  UserProfile,
} from '@catstack/catwatch/types';

import Peer from 'simple-peer';
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

  const createInitiatorPeer = useCallback(
    (callerId: number, calleeId: number, stream?: MediaStream) => {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        config: SERVERS,
      });
      peer.on('signal', (signal) => {
        socket.emit(Events.SendingSignal, {
          toUserId: calleeId,
          fromUserId: callerId,
          signal,
        });
      });

      peer.on('connect', handlePeerConnection('Initiator'));
      peer.on('error', handlerError);
      return peer;
    },
    [socket]
  );

  const createListenerPeer = useCallback(
    (incomingSignal: Peer.SignalData, callerId: number) => {
      console.log(`⚡️ Waiting for peer connection from ${callerId}`);
      const peer = new Peer({
        initiator: false,
        trickle: false,
        config: SERVERS,
      });

      peer.on('signal', (signal) => {
        socket.emit(Events.ReturningSignal, {
          toUserId: callerId,
          fromUserId: userId,
          signal,
        });
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

    socket.emit(ClientEvents.JoinRoom, roomId);
    return () => {
      Object.entries(peers).forEach(([id, peer]) => peer.destroy());
      socket.emit(ClientEvents.LeaveRoom, roomId);
    };
  });

  useEffect(() => {
    const peers = peersRef.current;

    socket.on(Events.AllUsers, (users) => {
      console.log('⚡️ Got all users from server on join', users);

      if (!users.length) {
        console.log('⚡️ No one in the room waiting for participants');
      }
      users.forEach((user) => {
        if (user.id === userId || peers[user.id]) return;
        const peer = createInitiatorPeer(userId, user.id);
        console.log(
          `⚡️ Initiate peer connection to from ${userId} to ${user.id}`
        );
        peers[user.id] = peer;
      });
    });

    socket.on(ServerEvents.RoomJoined, (payload) => {
      const peer = createListenerPeer(payload.signal, payload.fromUserId);
      peers[payload.fromUserId] = peer;
    });

    socket.on(Events.RecievingReturnedSignal, (message) => {
      peers[message.fromUserId]?.signal(message.signal);
    });
  }, [createInitiatorPeer, createListenerPeer, roomId, socket, userId]);

  return <div className="p-8 bg-white rounded-lg">Video Call Container</div>;
};
