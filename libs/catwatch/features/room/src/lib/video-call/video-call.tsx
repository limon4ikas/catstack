import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Peer from 'simple-peer';

import { Events, ClientEvents, ServerEvents } from '@catstack/catwatch/types';
import { usePeersManager } from '@catstack/shared/rtc';
import { useSocket } from '@catstack/catwatch/data-access';
import { selectUserId } from '@catstack/catwatch/features/auth';

export interface VideoCallContainerProps {
  roomId: string;
  file: File;
}

export const VideoCallContainer = ({
  roomId,
  file,
}: VideoCallContainerProps) => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const handleSendOffer = (
    signal: Peer.SignalData,
    callerId: number,
    calleeId: number
  ) => {
    socket.emit(Events.SendOffer, {
      toUserId: calleeId,
      fromUserId: callerId,
      signal,
    });
  };

  const handleReturnSignal = (signal: Peer.SignalData, callerId: number) => {
    socket.emit(Events.AnswerOffer, {
      toUserId: callerId,
      fromUserId: userId,
      signal,
    });
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

  return (
    <div>
      <video
        controls
        className="h-full rounded-lg"
        // src={URL.createObjectURL(file)}
        muted
        autoPlay
      />
    </div>
  );
};
