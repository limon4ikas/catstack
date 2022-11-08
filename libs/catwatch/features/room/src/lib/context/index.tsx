import {
  createContext,
  PropsWithChildren,
  useMemo,
  useContext,
  useCallback,
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
import { usePeersManager } from '@catstack/shared/rtc';
import { useSocket } from '@catstack/catwatch/data-access';
import { useAuth } from '@catstack/catwatch/features/auth';
import { newRoomEventMessage } from '@catstack/catwatch/actions';

import { roomActions } from '../room-slice';
import { useEffectOnce } from 'react-use';

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
  const { id: userId } = useAuth();
  const dispatch = useDispatch();
  const socket = useSocket();
  const [streams, setStreams] = useState<Record<string, MediaStream>>({});

  const handleSendOffer = (
    signal: SignalData,
    callerId: number,
    calleeId: number
  ) => {
    const offer: SignalMessage = {
      toUserId: calleeId,
      fromUserId: callerId,
      signal,
    };

    socket.emit(Events.SendOffer, offer);
  };

  const handleReturnSignal = (signal: SignalData, callerId: number) => {
    const answer: SignalMessage = {
      toUserId: callerId,
      fromUserId: userId,
      signal,
    };

    socket.emit(Events.AnswerOffer, answer);
  };

  const handleConnection = useCallback(
    (userId: number) => {
      dispatch(
        roomActions.updateConnectionStatus({ userId, state: 'connected' })
      );
      dispatch(newRoomEventMessage(`User ${userId} joined`));
    },
    [dispatch]
  );

  const handleConnectionClose = (userId: number) => {
    dispatch(
      roomActions.updateConnectionStatus({ userId, state: 'not-connected' })
    );
  };

  const handleChannelMessage = (action: PayloadAction<unknown>) => {
    dispatch(action);
  };

  const handleRemoteStream = (userId: number, stream: MediaStream) => {
    setStreams((prev) => ({ ...prev, [userId]: stream }));
  };

  const {
    send,
    destroyConnection,
    destroyPeers,
    createPeersConnections,
    listenForPeer,
    handleAnswer,
  } = usePeersManager({
    userId,
    onChannelMessage: handleChannelMessage,
    onSendSignal: handleSendOffer,
    onReturnSignal: handleReturnSignal,
    onConnection: handleConnection,
    onClose: handleConnectionClose,
    onRemoteStream: handleRemoteStream,
  });

  const handleRoomLeft = (user: UserProfile) => {
    destroyConnection(user.id.toString());
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
      send(newRoomEventMessage(`User ${userId} left chat`));
      socket.emit(ClientEvents.LeaveRoom, roomId);
      socket.off(ServerEvents.RoomJoined, listenForPeer);
      socket.off(Events.AllUsers, createPeersConnections);
      socket.off(Events.onAnswer, handleAnswer);
      socket.off(ServerEvents.onRoomLeft, handleRoomLeft);
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
