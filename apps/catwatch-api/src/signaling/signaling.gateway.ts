import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import {
  ClientToServerEvents,
  ClientEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
  ServerEvents,
  SocketWithAuth,
} from '@catstack/catwatch/types';

import { Services } from '../constants';
import { RoomsService } from '../rooms/rooms.service';

import { GatewaySessionManager } from './signaling.sessions';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
})
export class SignalingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(Services.SignalingGateway);
  @WebSocketServer()
  server: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;

  constructor(
    private readonly roomsService: RoomsService,
    private readonly sessions: GatewaySessionManager
  ) {}

  afterInit() {
    this.logger.log('⚡️ Websocket gateway initialized');
  }

  handleConnection(client: SocketWithAuth) {
    this.sessions.setUserSocket(client.user.id, client);
    this.logger.log(`⚡️ Client connected: ${client.id}`);
  }

  handleDisconnect(client: SocketWithAuth) {
    this.sessions.removeUserSocket(client.user.id);
    this.logger.log(`⚡️ Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(ClientEvents.onRoomCreate)
  handleCreateRoom(client: SocketWithAuth) {
    const room = this.roomsService.createRoom();

    client.join(room.id);

    this.server.to(room.id).emit(ServerEvents.CreateRoom, room.id);
    this.server.to(client.id).emit(ServerEvents.JoinRoom, room.id);
  }

  @SubscribeMessage(ClientEvents.onRoomDelete)
  handleDeleteRoom(client: SocketWithAuth, roomId: string) {
    this.roomsService.deleteRoom(roomId);

    this.server.to(roomId).emit(ServerEvents.DeleteRoom);

    this.server.in(roomId).socketsLeave(roomId);
  }

  @SubscribeMessage(ClientEvents.onRoomJoin)
  handleJoinRoom(client: SocketWithAuth, roomId: string) {
    this.roomsService.joinRoom(roomId, client.id);

    client.join(roomId);

    this.server.to(roomId).emit(ServerEvents.JoinRoom, client.id);
  }

  @SubscribeMessage(ClientEvents.onRoomLeave)
  handleLeaveRoom(client: SocketWithAuth, roomId: string) {
    this.roomsService.leaveRoom(roomId, client.id);

    client.leave(roomId);

    this.server.to(roomId).emit(ServerEvents.LeaveRoom, client.id);
  }
}
