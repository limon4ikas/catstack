import {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useContext,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PayloadAction } from '@reduxjs/toolkit';
import { SignalData } from 'simple-peer';

import {
  Events,
  ClientEvents,
  ServerEvents,
  SignalMessage,
} from '@catstack/catwatch/types';
import { usePeersManager } from '@catstack/shared/rtc';
import { useSocket } from '@catstack/catwatch/data-access';
import { selectUserId } from '@catstack/catwatch/features/auth';

export interface IRoomContext {
  send: (action: PayloadAction<unknown>) => void;
}

export const RoomContext = createContext<IRoomContext | null>(null);

export interface RoomContextProviderProps extends PropsWithChildren {
  roomId: string;
}

export const RoomContextProvider = ({
  roomId,
  children,
}: RoomContextProviderProps) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const socket = useSocket();

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

  const {
    send,
    destroyConnection,
    destroyPeers,
    createPeersConnections,
    listenForPeer,
    handleAnswer,
  } = usePeersManager({
    userId,
    onChannelMessage: dispatch,
    onSendSignal: handleSendOffer,
    onReturnSignal: handleReturnSignal,
  });

  useEffect(() => {
    (async () => {
      socket.emit(ClientEvents.JoinRoom, roomId);
      socket.on(Events.AllUsers, createPeersConnections);
      socket.on(ServerEvents.RoomJoined, listenForPeer);
      socket.on(Events.onAnswer, handleAnswer);
      socket.on(ServerEvents.onRoomLeft, destroyConnection);
    })();

    return () => {
      socket.emit(ClientEvents.LeaveRoom, roomId);
      socket.off(ServerEvents.RoomJoined, listenForPeer);
      socket.off(Events.AllUsers, createPeersConnections);
      socket.off(Events.onAnswer, handleAnswer);
      socket.off(ServerEvents.onRoomLeft, destroyConnection);
      destroyPeers();
    };
  }, [
    roomId,
    userId,
    socket,
    destroyPeers,
    destroyConnection,
    createPeersConnections,
    listenForPeer,
    handleAnswer,
  ]);

  const context = useMemo<IRoomContext>(() => ({ send }), [send]);

  return (
    <RoomContext.Provider value={context}>{children}</RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const context = useContext(RoomContext);

  if (!context) throw new Error('Must use useRoomContext inside RoomProvider');

  return context;
};
