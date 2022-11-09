import { useCallback, useRef } from 'react';
import { PayloadAction } from '@reduxjs/toolkit';
import Peer, { SignalData } from 'simple-peer';
import type { Instance } from 'simple-peer';

import { SignalMessage, UserProfile } from '@catstack/catwatch/types';
import { useUserMedia } from '@catstack/shared/hooks';

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
    callerId: UserProfile,
    calleeId: UserProfile
  ) => void;
  /** Called  when peer answering offer from another peer*/
  onReturnSignal: (signal: SignalData, caller: UserProfile) => void;
  /** Gets channel messages parses it and sends result to handler */
  onChannelMessage: (chunk: Uint8Array) => void;
  /** Called when peer offers user video/audio with media stream */
  onRemoteStream: (user: UserProfile, stream: MediaStream) => void;
  /** Called when connection is established with another peer */
  onConnection: (user: UserProfile) => void;
  /** Called when connection is closed with another peer */
  onClose: (user: UserProfile) => void;
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

  const { getMedia } = useUserMedia();

  const createInitiatorPeer = useCallback(
    async (caller: UserProfile, callee: UserProfile) => {
      // const stream = await getMedia({ video: true });

      console.log(
        `⚡️ Initiate peer connection to from ${caller.username} to ${callee.username}`
      );

      const pc = new Peer({
        initiator: true,
        trickle: false,
        config: SERVERS,
        // stream,
      });

      pc.on('signal', (signal) => onSendSignal(signal, caller, callee));
      pc.on('stream', (stream) => {
        console.log(`⚡️ Got media stream from ${callee.username}`, stream);
        onRemoteStream(callee, stream);
      });

      pc.on('connect', () => {
        console.log(
          `⚡️ Initiator connection established from ${caller.username} to ${callee.username}`
        );
        onConnection(callee);
      });
      pc.on('close', () => {
        console.log(`⚡️ Closed connection with ${callee.username}`);
        onClose(callee);
      });
      pc.on('error', handlerError);
      pc.on('data', onChannelMessage);

      return pc;
    },
    [
      getMedia,
      onChannelMessage,
      onClose,
      onConnection,
      onRemoteStream,
      onSendSignal,
    ]
  );

  const createListenerPeer = useCallback(
    async (incomingSignal: SignalData, callerId: UserProfile) => {
      // const stream = await getMedia({ video: true });

      console.log(`⚡️ Waiting for peer connection from ${callerId.username}`);

      const pc = new Peer({
        initiator: false,
        trickle: false,
        config: SERVERS,
        // stream,
      });

      pc.on('signal', (signal) => onReturnSignal(signal, callerId));
      pc.on('stream', (stream) => {
        console.log(`⚡️ Got media stream from ${callerId}`, stream);
        onRemoteStream(callerId, stream);
      });
      pc.on('error', handlerError);
      pc.on('connect', () => {
        console.log(
          `⚡️ Listener connection established with ${callerId.username}`
        );
        onConnection(callerId);
      });
      pc.on('data', onChannelMessage);
      pc.signal(incomingSignal);

      return pc;
    },
    [getMedia, onChannelMessage, onConnection, onRemoteStream, onReturnSignal]
  );

  return { createInitiatorPeer, createListenerPeer } as const;
};

export interface UsePeersManagerConfig
  extends Pick<
    UsePeerFactoryConfig,
    | 'onSendSignal'
    | 'onReturnSignal'
    | 'onConnection'
    | 'onClose'
    | 'onRemoteStream'
  > {
  /** Id of the current user */
  currentUser: UserProfile;
  /** Called when parsed message from data channel and got message from another peer */
  onChannelMessage: (action: PayloadAction<unknown>) => void;
}

export const usePeersManager = (config: UsePeersManagerConfig) => {
  const {
    currentUser,
    onChannelMessage,
    onSendSignal,
    onReturnSignal,
    onConnection,
    onClose,
    onRemoteStream,
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

    const peer = peers[message.fromUserId.id];
    if (!peer || peer.destroyed) {
      console.warn(`⚡ Peer is destroyed cannot signal️`);
      return;
    }

    peer.signal(message.signal);
  };

  const handleConnectionClose = (userId: UserProfile) => {
    destroyConnection(userId.toString());
    onClose(userId);
  };

  const { createInitiatorPeer, createListenerPeer } = usePeerFactory({
    onChannelMessage: handleDataChannelMessage,
    onClose: handleConnectionClose,
    onConnection,
    onSendSignal,
    onReturnSignal,
    onRemoteStream,
  });

  /** Sends messages to peers */
  const send = useCallback((action: PayloadAction<unknown>) => {
    const peers = peersRef.current;

    Object.entries(peers).forEach(([userId, peer]) => {
      if (!peer || peer.destroyed) {
        console.log(
          '⚡️ Cannot send message because peer connection destroyed'
        );
        delete peers[userId];
        return;
      }

      peer.send(JSON.stringify(action));
    });
  }, []);

  const createPeersConnections = useCallback(
    (users: UserProfile[]) => {
      const peers = peersRef.current;

      const createConnection = async (user: UserProfile) => {
        if (user.id === currentUser.id || peers[user.id]) {
          return console.log('⚡️ Skipping connection');
        }

        peers[user.id] = await createInitiatorPeer(currentUser, user);
      };

      if (!users.length) {
        console.log('⚡️ No one in the room waiting for participants');
      }

      users.forEach(createConnection);
    },
    [createInitiatorPeer, currentUser]
  );

  const listenForPeer = useCallback(
    async ({ fromUserId, signal }: SignalMessage) => {
      const peers = peersRef.current;
      console.log('⚡️ User joined creating listener peer');

      peers[fromUserId.id] = await createListenerPeer(signal, fromUserId);
    },
    [createListenerPeer]
  );

  const destroyConnection = useCallback(
    (leftUserId: string) => {
      const peers = peersRef.current;
      console.log(
        `⚡️ Destroy connection from ${currentUser.username} to ${leftUserId}`
      );

      if (!peers[leftUserId]) {
        console.warn('⚡️ No connection for this user, please check');
      }

      peers[leftUserId]?.destroy();
    },
    [currentUser.username]
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
