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
    this.logger.debug(`⚡️ ${client.user.username} created room ${room.id}`);
    client.join(room.id);
    this.server.to(room.id).emit(ServerEvents.CreateRoom, room.id);
    this.server.to(client.id).emit(ServerEvents.JoinRoom, client.user);
  }

  @SubscribeMessage(ClientEvents.onRoomDelete)
  handleDeleteRoom(client: SocketWithAuth, roomId: string) {
    this.roomsService.deleteRoom(roomId);
    this.logger.debug(`⚡️ ${client.user.username} deleted room ${roomId}`);
    this.server.to(roomId).emit(ServerEvents.DeleteRoom, roomId);
    this.server.in(roomId).socketsLeave(roomId);
  }

  @SubscribeMessage(ClientEvents.onRoomJoin)
  handleJoinRoom(client: SocketWithAuth, roomId: string) {
    this.logger.debug(`⚡️ ${client.user.username} joined room ${roomId}`);
    client.join(roomId);
    this.roomsService.joinRoom(roomId, client.user);
    this.server.to(roomId).emit(ServerEvents.JoinRoom, client.user);
  }

  @SubscribeMessage(ClientEvents.onRoomLeave)
  handleLeaveRoom(client: SocketWithAuth, roomId: string) {
    this.logger.debug(`⚡️ ${client.user.username} left room ${roomId}`);
    client.leave(roomId);
    this.roomsService.leaveRoom(roomId, client.user.id);
    this.server.to(roomId).emit(ServerEvents.LeaveRoom, client.user);
  }

  @SubscribeMessage('rtc')
  handleRtcHandshake(
    client: SocketWithAuth,
    messageObj: { userId: number; message: unknown }
  ) {
    this.logger.debug(
      `⚡️ ${client.user.username} handshake initiate to ${messageObj.userId}`
    );

    const userSocket = this.sessions.getUserSocket(messageObj.userId);
    userSocket.emit('rtc', messageObj.message);
  }
}
