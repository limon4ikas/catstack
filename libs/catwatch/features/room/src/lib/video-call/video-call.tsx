import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid, PayloadAction } from '@reduxjs/toolkit';
import Peer, { SignalData } from 'simple-peer';

import { useUserMedia } from '@catstack/shared/hooks';
import { useSocket } from '@catstack/catwatch/data-access';
import {
  ClientEvents,
  Events,
  RoomMessage,
  ServerEvents,
  SignalMessage,
  UserProfile,
} from '@catstack/catwatch/types';
import { handlePeerConnection, handlerError } from '@catstack/shared/rtc';
import { selectUserId } from '@catstack/catwatch/features/auth';
import { Button, Input } from '@catstack/shared/vanilla';

import { getAllRoomMessages, getUserById } from '../room-slice';
import { messageAdded } from '@catstack/catwatch/actions';

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
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const peersRef = useRef<Record<string, Peer.Instance>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  const { getMedia } = useUserMedia();

  const handleDataChannelMessage = useCallback(
    (action: Uint8Array) => {
      const decoded = new TextDecoder('utf-8').decode(action);
      console.log('⚡️ Got message from channel', decoded);
      try {
        const action: PayloadAction<unknown> = JSON.parse(decoded);
        dispatch(action);
      } catch {
        //
      }
    },
    [dispatch]
  );

  const handleSendMessage = (messageAction: PayloadAction<RoomMessage>) => {
    const peers = peersRef.current;

    Object.values(peers).forEach((peer) =>
      peer.send(JSON.stringify(messageAction))
    );
  };

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
      pc.on('signal', (signal) =>
        socket.emit(Events.SendingSignal, {
          toUserId: calleeId,
          fromUserId: callerId,
          signal,
        })
      );

      pc.on('stream', (stream) => {
        console.log('⚡️ Got remote stream', stream);
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
      });
      pc.on('connect', handlePeerConnection('Initiator'));
      pc.on('error', handlerError);
      pc.on('data', handleDataChannelMessage);
      return pc;
    },
    [getMedia, handleDataChannelMessage, socket]
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
        console.log('⚡️ Got remote stream', stream);
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
      });
      pc.on('error', handlerError);
      pc.on('connect', handlePeerConnection('Listener'));
      pc.on('data', handleDataChannelMessage);
      pc.signal(incomingSignal);

      return pc;
    },
    [getMedia, handleDataChannelMessage, socket, userId]
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
      <div className="flex flex-col gap-8">
        <ChatWindowContainer onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export interface SendMessageFormProps {
  onSendMessage: (message: string) => void;
}

const SendMessageForm = ({ onSendMessage }: SendMessageFormProps) => {
  const [message, setMessage] = useState('');

  return (
    <div className="flex w-full gap-4">
      <Input
        label="Send message"
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={() => onSendMessage(message)}>Send</Button>
    </div>
  );
};

export interface ChatWindowProps {
  messages: RoomMessage[];
}

const ChatWindow = ({ messages }: ChatWindowProps) => {
  return (
    <ul className="flex flex-col gap-4">
      {messages.map((message, idx) => (
        <li key={idx}>
          {message.username}: {message.text}
        </li>
      ))}
    </ul>
  );
};

export interface ChatWindowContainerProps {
  onSendMessage: (message: PayloadAction<RoomMessage>) => void;
}

export const ChatWindowContainer = (props: ChatWindowContainerProps) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const currentUser = useSelector(getUserById(userId));
  const messages = useSelector(getAllRoomMessages);

  const handleSendMessage = (text: string) => {
    if (!currentUser) return;

    const message: RoomMessage = {
      id: nanoid(),
      text,
      timestamp: new Date().toISOString(),
      username: currentUser.username,
    };
    props.onSendMessage(messageAdded(message));
    dispatch(messageAdded(message));
  };

  return (
    <div className="flex flex-col gap-8">
      <ChatWindow messages={messages} />
      <SendMessageForm onSendMessage={handleSendMessage} />
    </div>
  );
};
