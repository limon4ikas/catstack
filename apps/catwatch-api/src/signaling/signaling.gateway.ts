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
  Events,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from '@catstack/catwatch/types';

import { Services } from '../constants';
import { RoomsService } from '../rooms/rooms.service';
import { SocketWithAuth } from '../auth/auth.types';
import { GatewaySessionManager } from './signaling.sessions';

@WebSocketGateway({ cors: { origin: '*' } })
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
    this.sessions.setUserSocket(client.user.userId, client);
    this.logger.log(`⚡️ Client connected: ${client.id}`);
  }

  handleDisconnect(client: SocketWithAuth) {
    this.sessions.removeUserSocket(client.user.userId);
    this.logger.log(`⚡️ Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(Events.CreateRoom)
  handleCreateRoom(client: SocketWithAuth) {
    const room = this.roomsService.createRoom();

    client.join(room.id);

    this.server.to(room.id).emit(Events.CreateRoom, room.id);
    this.server.to(client.id).emit(Events.JoinRoom, room.id);
  }

  @SubscribeMessage(Events.DeleteRoom)
  handleDeleteRoom(client: SocketWithAuth, roomId: string) {
    this.roomsService.deleteRoom(roomId);

    this.server.to(roomId).emit(Events.DeleteRoom);

    this.server.in(roomId).socketsLeave(roomId);
  }

  @SubscribeMessage(Events.JoinRoom)
  handleJoinRoom(client: SocketWithAuth, roomId: string) {
    this.roomsService.joinRoom(roomId, client.id);

    client.join(roomId);

    this.server.to(roomId).emit(Events.JoinRoom, client.id);
  }

  @SubscribeMessage(Events.LeaveRoom)
  handleLeaveRoom(client: SocketWithAuth, roomId: string) {
    this.roomsService.leaveRoom(roomId, client.id);

    client.leave(roomId);

    this.server.to(roomId).emit(Events.LeaveRoom, client.id);
  }
}
