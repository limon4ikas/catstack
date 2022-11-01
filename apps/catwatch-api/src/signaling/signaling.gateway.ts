import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
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
  RTCSignalMessage,
  Events,
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
    this.server.to(room.id).emit(ServerEvents.RoomCreated, room.id);
    this.server.to(client.id).emit(ServerEvents.RoomJoined, client.user);
  }

  @SubscribeMessage(ClientEvents.onRoomDelete)
  handleDeleteRoom(client: SocketWithAuth, roomId: string) {
    this.roomsService.deleteRoom(roomId);
    this.logger.debug(`⚡️ ${client.user.username} deleted room ${roomId}`);
    this.server.to(roomId).emit(ServerEvents.RoomDeleted, roomId);
    this.server.in(roomId).socketsLeave(roomId);
  }

  @SubscribeMessage(ClientEvents.onRoomJoin)
  handleJoinRoom(client: SocketWithAuth, roomId: string) {
    this.logger.debug(`⚡️ ${client.user.username} joined room ${roomId}`);
    client.join(roomId);
    this.roomsService.joinRoom(roomId, client.user);
    this.server.to(roomId).emit(ServerEvents.RoomJoined, client.user);
  }

  @SubscribeMessage(ClientEvents.onRoomLeave)
  handleLeaveRoom(client: SocketWithAuth, roomId: string) {
    this.logger.debug(`⚡️ ${client.user.username} left room ${roomId}`);
    client.leave(roomId);
    this.roomsService.leaveRoom(roomId, client.user.id);
    this.server.to(roomId).emit(ServerEvents.RoomLeft, client.user);
  }

  @SubscribeMessage(Events.WebRtc)
  handleRtcHandshake(_client: SocketWithAuth, message: RTCSignalMessage) {
    const recepient = this.sessions.getUserSocket(message.toUserId);

    if (!recepient) throw new WsException('User offline');

    switch (message.type) {
      case 'offer':
        this.logger.debug(
          `⚡️ Offer from ${message.fromUserId} to ${message.toUserId}`
        );

        this.server.to(recepient.id).emit(Events.WebRtc, message);
        break;
      case 'answer':
        this.logger.debug(
          `⚡️ Answer from ${message.fromUserId} to ${message.toUserId}`
        );

        this.server.to(recepient.id).emit(Events.WebRtc, message);
        break;
      case 'candidate':
        this.logger.debug(
          `⚡️ Candidate from ${message.fromUserId} to ${message.toUserId}`
        );

        this.server.to(recepient.id).emit(Events.WebRtc, message);
        break;
      default:
        return;
    }
  }
}
