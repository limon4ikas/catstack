import { useCallback, useRef } from 'react';
import { PayloadAction } from '@reduxjs/toolkit';
import Peer, { SignalData } from 'simple-peer';
import type { Instance } from 'simple-peer';

import { SignalMessage, UserProfile } from '@catstack/catwatch/types';

import { handlerError } from './events';

const SERVERS: RTCConfiguration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

export interface UsePeerFactoryConfig {
  /** Called when peer wants to send signal to another peer */
  onSendSignal: (
    signal: SignalData,
    callerId: number,
    calleeId: number
  ) => void;
  /** Called  when peer answering offer from another peer*/
  onReturnSignal: (signal: SignalData, callerId: number) => void;
  /** Gets channel messages parses it and sends result to handler */
  onChannelMessage: (chunk: Uint8Array) => void;
  /** Called when peer offers user video/audio with media stream */
  onRemoteStream: (stream: MediaStream) => void;
  /** Called when connection is established with another peer */
  onConnection: (userId: number) => void;
  /** Called when connection is closed with another peer */
  onClose: (userId: number) => void;
}

export const usePeerFactory = (config: UsePeerFactoryConfig) => {
  const {
    onSendSignal,
    onReturnSignal,
    onChannelMessage,
    onRemoteStream,
    onConnection,
    onClose,
  } = config;

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
      pc.on('connect', () => {
        console.log(
          `⚡️ Initiator connection established from ${callerId} to ${calleeId}`
        );
        onConnection(calleeId);
      });
      pc.on('close', () => {
        console.log(`⚡️ Closed connection with ${calleeId}`);
        onClose(calleeId);
      });
      pc.on('error', handlerError);
      pc.on('data', onChannelMessage);

      return pc;
    },
    [onChannelMessage, onClose, onConnection, onRemoteStream, onSendSignal]
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
      pc.on('connect', () => {
        console.log(`⚡️ Listener connection established with ${callerId}`);
        onConnection(callerId);
      });
      pc.on('data', onChannelMessage);
      pc.signal(incomingSignal);

      return pc;
    },
    [onChannelMessage, onConnection, onRemoteStream, onReturnSignal]
  );

  return { createInitiatorPeer, createListenerPeer } as const;
};

export interface UsePeersManagerConfig
  extends Pick<
    UsePeerFactoryConfig,
    'onSendSignal' | 'onReturnSignal' | 'onConnection' | 'onClose'
  > {
  /** Id of the current user */
  userId: number;
  /** Called when parsed message from data channel and got message from another peer */
  onChannelMessage: (action: PayloadAction<unknown>) => void;
}

export const usePeersManager = (config: UsePeersManagerConfig) => {
  const {
    userId,
    onChannelMessage,
    onSendSignal,
    onReturnSignal,
    onConnection,
    onClose,
  } = config;
  const peersRef = useRef<Record<string, Instance>>({});

  const handleDataChannelMessage = useCallback(
    (action: Uint8Array) => {
      const decoded = new TextDecoder('utf-8').decode(action);
      console.log('⚡️ Got message from channel', decoded);

      try {
        const action: PayloadAction<unknown> = JSON.parse(decoded);
        onChannelMessage(action);
      } catch {
        console.error('⚡️ Failed parsing message from data channel', decoded);
      }
    },
    [onChannelMessage]
  );

  const handleAnswer = (message: SignalMessage) => {
    const peers = peersRef.current;

    peers[message.fromUserId]?.signal(message.signal);
  };

  const handleConnectionClose = (userId: number) => {
    destroyConnection(userId.toString());
    onClose(userId);
  };

  const { createInitiatorPeer, createListenerPeer } = usePeerFactory({
    onChannelMessage: handleDataChannelMessage,
    onClose: handleConnectionClose,
    onConnection,
    onSendSignal,
    onReturnSignal,
    onRemoteStream: () => console.log(''),
  });

  /** Sends messages to peers */
  const send = useCallback((action: PayloadAction<unknown>) => {
    const peers = peersRef.current;

    Object.values(peers).forEach((peer) => {
      if (!peer) {
        console.log(
          '⚡️ Cannot send message because peer connection destroyed, probably you are in DEV mode or something went wrong'
        );
        return;
      }

      peer.send(JSON.stringify(action));
    });
  }, []);

  const createPeersConnections = useCallback(
    (users: UserProfile[]) => {
      const peers = peersRef.current;

      const createConnection = async (user: UserProfile) => {
        if (user.id === userId || peers[user.id]) {
          return console.log('⚡️ Skipping connection');
        }

        peers[user.id] = await createInitiatorPeer(userId, user.id);
      };

      if (!users.length) {
        console.log('⚡️ No one in the room waiting for participants');
      }

      users.forEach(createConnection);
    },
    [createInitiatorPeer, userId]
  );

  const listenForPeer = useCallback(
    async ({ fromUserId, signal }: SignalMessage) => {
      const peers = peersRef.current;
      console.log('⚡️ User joined creating listener peer');

      peers[fromUserId] = await createListenerPeer(signal, fromUserId);
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
