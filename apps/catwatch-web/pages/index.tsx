import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { NextPage } from 'next';

import {
  ServerToClientEvents,
  ClientToServerEvents,
  ServerEvents,
  ClientEvents,
} from '@catstack/catwatch/types';
import { Layout } from '@catstack/shared/vanilla';
import { withAuth } from '@catstack/catwatch/features/auth';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://localhost:3333',
  { withCredentials: true, requestTimeout: 100 }
);

const Index: NextPage = () => {
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    const onRoomCreate = (roomId: string) => {
      console.log('Joined room', roomId);
    };
    const onRoomJoin = (roomId: string) => {
      setRoomId(roomId);
    };

    const onRoomLeave = (roomId: string) => {
      console.log('Left room', roomId);
    };

    socket.on(ServerEvents.CreateRoom, onRoomCreate);
    socket.on(ServerEvents.JoinRoom, onRoomJoin);
    socket.on(ServerEvents.LeaveRoom, onRoomLeave);
    return () => {
      socket.off(ServerEvents.CreateRoom, onRoomCreate);
      socket.off(ServerEvents.JoinRoom, onRoomJoin);
      socket.off(ServerEvents.LeaveRoom, onRoomLeave);
    };
  }, []);

  const handleCreateRoomClick = () => socket.emit(ClientEvents.onRoomCreate);
  const handleJoinRoomClick = () =>
    socket.emit(ClientEvents.onRoomJoin, roomId);
  const handleLeaveRoomClick = () =>
    socket.emit(ClientEvents.onRoomLeave, roomId);

  return (
    <Layout>
      <div>
        <h1>{roomId}</h1>
        <button onClick={handleCreateRoomClick}>Create room</button>
        <button onClick={handleJoinRoomClick}>Join room</button>
        <button onClick={handleLeaveRoomClick}>Leave room</button>
        <input
          type="text"
          placeholder="Room ID"
          onChange={(e) => setRoomId(e.target.value)}
        />
      </div>
    </Layout>
  );
};

export default withAuth(Index)();
