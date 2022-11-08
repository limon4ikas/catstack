import {
  createContext,
  PropsWithChildren,
  useMemo,
  useContext,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { PayloadAction } from '@reduxjs/toolkit';
import { SignalData } from 'simple-peer';

import {
  Events,
  ClientEvents,
  ServerEvents,
  SignalMessage,
  UserProfile,
} from '@catstack/catwatch/types';
import { useEffectOnce } from '@catstack/shared/hooks';
import { usePeersManager } from '@catstack/shared/rtc';
import { useSocket } from '@catstack/catwatch/data-access';
import { useAuth } from '@catstack/catwatch/features/auth';
import { newRoomEventMessage } from '@catstack/catwatch/actions';

import { roomActions } from '../room-slice';

export interface IRoomContext {
  send: (action: PayloadAction<unknown>) => void;
  streams: Record<string, MediaStream | undefined>;
}

export const RoomContext = createContext<IRoomContext | null>(null);

export interface RoomContextProviderProps extends PropsWithChildren {
  roomId: string;
}

export const RoomContextProvider = ({
  roomId,
  children,
}: RoomContextProviderProps) => {
  const currentUser = useAuth();
  const dispatch = useDispatch();
  const socket = useSocket();
  const [streams, setStreams] = useState<Record<string, MediaStream>>({});

  const handleSendOffer = (
    signal: SignalData,
    caller: UserProfile,
    calle: UserProfile
  ) => {
    const offer: SignalMessage = {
      toUserId: calle,
      fromUserId: caller,
      signal,
    };

    socket.emit(Events.SendOffer, offer);
  };

  const handleReturnSignal = (signal: SignalData, caller: UserProfile) => {
    const answer: SignalMessage = {
      toUserId: caller,
      fromUserId: currentUser,
      signal,
    };

    socket.emit(Events.AnswerOffer, answer);
  };

  const handleConnection = (user: UserProfile) => {
    dispatch(
      roomActions.updateConnectionStatus({
        userId: user.id,
        state: 'connected',
      })
    );

    send(newRoomEventMessage(`${currentUser.username} joined`));
  };

  const handleConnectionClose = (user: UserProfile) => {
    dispatch(
      roomActions.updateConnectionStatus({
        userId: user.id,
        state: 'not-connected',
      })
    );
  };

  const handleChannelMessage = (action: PayloadAction<unknown>) => {
    dispatch(action);
  };

  const handleRemoteStream = (user: UserProfile, stream: MediaStream) => {
    setStreams((prev) => ({ ...prev, [user.id]: stream }));
  };

  const {
    send,
    destroyConnection,
    destroyPeers,
    createPeersConnections,
    listenForPeer,
    handleAnswer,
  } = usePeersManager({
    currentUser: currentUser,
    onChannelMessage: handleChannelMessage,
    onSendSignal: handleSendOffer,
    onReturnSignal: handleReturnSignal,
    onConnection: handleConnection,
    onClose: handleConnectionClose,
    onRemoteStream: handleRemoteStream,
  });

  const handleRoomLeft = (leftUser: UserProfile) => {
    destroyConnection(leftUser.id.toString());
  };

  useEffectOnce(() => {
    (async () => {
      socket.emit(ClientEvents.JoinRoom, roomId);
      socket.on(Events.AllUsers, createPeersConnections);
      socket.on(ServerEvents.RoomJoined, listenForPeer);
      socket.on(Events.onAnswer, handleAnswer);
      socket.on(ServerEvents.onRoomLeft, handleRoomLeft);
    })();

    return () => {
      socket.emit(ClientEvents.LeaveRoom, roomId);
      socket.off(ServerEvents.RoomJoined, listenForPeer);
      socket.off(Events.AllUsers, createPeersConnections);
      socket.off(Events.onAnswer, handleAnswer);
      socket.off(ServerEvents.onRoomLeft, handleRoomLeft);

      send(newRoomEventMessage(`${currentUser.username} left chat`));
      dispatch(roomActions.reset());
      destroyPeers();
    };
  });

  const context = useMemo<IRoomContext>(
    () => ({ send, streams }),
    [send, streams]
  );

  return (
    <RoomContext.Provider value={context}>{children}</RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const context = useContext(RoomContext);

  if (!context) throw new Error('Must use useRoomContext inside RoomProvider');

  return context;
};
