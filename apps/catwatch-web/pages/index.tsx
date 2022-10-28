import { io, Socket } from 'socket.io-client';

import {
  ServerToClientEvents,
  ClientToServerEvents,
  Events,
} from '@catstack/catwatch/types';
import { useEffect, useState } from 'react';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://localhost:3333'
);

export function Index() {
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    socket.connect();

    const onRoomCreate = (roomId: string) => {
      console.log('Joined room', roomId);
    };
    const onRoomJoin = (roomId: string) => {
      setRoomId(roomId);
    };

    const onRoomLeave = (roomId: string) => {
      console.log('Left room', roomId);
    };

    socket.on(Events.CreateRoom, onRoomCreate);
    socket.on(Events.JoinRoom, onRoomJoin);
    socket.on(Events.LeaveRoom, onRoomLeave);
    return () => {
      socket.off(Events.CreateRoom, onRoomCreate);
      socket.off(Events.JoinRoom, onRoomJoin);
      socket.off(Events.LeaveRoom, onRoomLeave);
    };
  }, []);

  const handleCreateRoomClick = () => socket.emit(Events.CreateRoom);
  const handleJoinRoomClick = () => socket.emit(Events.JoinRoom, roomId);
  const handleLeaveRoomClick = () => socket.emit(Events.LeaveRoom, roomId);

  return (
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
  );
}

export default Index;
