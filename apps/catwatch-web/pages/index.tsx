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

    socket.on(Events.CreateRoom, (roomId) => {
      console.log('Created room', roomId);
    });
    socket.on(Events.DeleteRoom, () => {
      console.log('DELETED ROOM');
    });

    socket.on(Events.JoinRoom, (roomId) => {
      console.log('Joined room', roomId);
    });
    socket.on(Events.LeaveRoom, (roomId) => {
      console.log('Left room', roomId);
    });

    return () => {
      socket.off(Events.CreateRoom);
      socket.off(Events.DeleteRoom);
      socket.off(Events.JoinRoom);
      socket.off(Events.LeaveRoom);
    };
  }, []);

  const handleCreateRoomClick = () => {
    socket.emit(Events.CreateRoom);
  };

  const handleDeleteRoomClick = () => {
    socket.emit(Events.DeleteRoom, roomId);
  };

  const handleJoinRoomClick = () => {
    socket.emit(Events.JoinRoom, roomId);
  };

  const handleLeaveRoomClick = () => {
    socket.emit(Events.LeaveRoom, roomId);
  };

  return (
    <div>
      <h1>{roomId}</h1>
      <button onClick={handleCreateRoomClick}>Create room</button>
      <button onClick={handleDeleteRoomClick}>Delete room</button>
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
