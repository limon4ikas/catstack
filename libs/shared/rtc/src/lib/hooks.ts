import { useCallback, useRef } from 'react';
import { PayloadAction } from '@reduxjs/toolkit';
import Peer, { SignalData } from 'simple-peer';
import type { Instance } from 'simple-peer';

import { SignalMessage, UserProfile } from '@catstack/catwatch/types';

import { handlePeerConnection, handlerError } from './events';

const SERVERS: RTCConfiguration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

export interface UsePeerFactoryConfig {
  onSendSignal: (
    signal: SignalData,
    callerId: number,
    calleeId: number
  ) => void;
  onReturnSignal: (signal: SignalData, callerId: number) => void;
  onChannelMessage: (chunk: Uint8Array) => void;
  onRemoteStream: (stream: MediaStream) => void;
}

export const usePeerFactory = (config: UsePeerFactoryConfig) => {
  const { onSendSignal, onReturnSignal, onChannelMessage, onRemoteStream } =
    config;

  const createInitiatorPeer = useCallback(
    async (callerId: number, calleeId: number) => {
      console.log(
        `⚡️ Initiate peer connection to from ${callerId} to ${calleeId}`
      );

      const pc = new Peer({
        initiator: true,
        trickle: false,
        config: SERVERS,
      });

      pc.on('signal', (signal) => onSendSignal(signal, callerId, calleeId));
      pc.on('stream', onRemoteStream);
      pc.on('connect', handlePeerConnection('Initiator'));
      pc.on('error', handlerError);
      pc.on('data', onChannelMessage);

      return pc;
    },
    [onChannelMessage, onRemoteStream, onSendSignal]
  );

  const createListenerPeer = useCallback(
    async (incomingSignal: SignalData, callerId: number) => {
      console.log(`⚡️ Waiting for peer connection from ${callerId}`);

      const pc = new Peer({
        initiator: false,
        trickle: false,
        config: SERVERS,
      });

      pc.on('signal', (signal) => onReturnSignal(signal, callerId));
      pc.on('stream', onRemoteStream);
      pc.on('error', handlerError);
      pc.on('connect', handlePeerConnection('Listener'));
      pc.on('data', onChannelMessage);
      pc.signal(incomingSignal);

      return pc;
    },
    [onChannelMessage, onRemoteStream, onReturnSignal]
  );

  return { createInitiatorPeer, createListenerPeer } as const;
};

export interface UsePeersManagerConfig
  extends Pick<UsePeerFactoryConfig, 'onSendSignal' | 'onReturnSignal'> {
  userId: number;
  onChannelMessage: (action: PayloadAction<unknown>) => void;
}

export const usePeersManager = (config: UsePeersManagerConfig) => {
  const { userId, onChannelMessage, onSendSignal, onReturnSignal } = config;
  const peersRef = useRef<Record<string, Instance>>({});

  const handleDataChannelMessage = useCallback(
    (action: Uint8Array) => {
      const decoded = new TextDecoder('utf-8').decode(action);
      console.log('⚡️ Got message from channel', decoded);
      try {
        const action: PayloadAction<unknown> = JSON.parse(decoded);
        onChannelMessage(action);
      } catch {
        //
      }
    },
    [onChannelMessage]
  );

  const handleAnswer = (message: SignalMessage) => {
    const peers = peersRef.current;

    peers[message.fromUserId]?.signal(message.signal);
  };

  const { createInitiatorPeer, createListenerPeer } = usePeerFactory({
    onChannelMessage: handleDataChannelMessage,
    onSendSignal,
    onReturnSignal,
    onRemoteStream: () => console.log(''),
  });

  const send = (action: PayloadAction<unknown>) => {
    const peers = peersRef.current;

    Object.values(peers).forEach((peer) => peer.send(JSON.stringify(action)));
  };

  const createPeersConnections = useCallback(
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

  const listenForPeer = useCallback(
    async (message: SignalMessage) => {
      const peers = peersRef.current;
      console.log('⚡️ User joined creating listener peer');

      const peer = await createListenerPeer(message.signal, message.fromUserId);
      peers[message.fromUserId] = peer;
    },
    [createListenerPeer]
  );

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

  return {
    destroyPeers,
    destroyConnection,
    send,
    createPeersConnections,
    listenForPeer,
    handleAnswer,
  };
};
