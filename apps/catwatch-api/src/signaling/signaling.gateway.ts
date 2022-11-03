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
  Events,
  SignalMessage,
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
    const rooms = this.roomsService.getAllRooms();
    rooms.forEach((room) => {
      if (!room.users.has(client.user.id)) return;
      room.removeUser(client.user.id);
    });
  }

  @SubscribeMessage(ClientEvents.CreateRoom)
  handleCreateRoom(client: SocketWithAuth) {
    const room = this.roomsService.createRoom();
    this.logger.debug(`⚡️ ${client.user.username} created room ${room.id}`);
    client.join(room.id);
    this.server.to(room.id).emit(ServerEvents.RoomCreated, room.id);
  }

  @SubscribeMessage(ClientEvents.DeleteRoom)
  handleDeleteRoom(client: SocketWithAuth, roomId: string) {
    this.roomsService.deleteRoom(roomId);
    this.logger.debug(`⚡️ ${client.user.username} deleted room ${roomId}`);
    this.server.to(roomId).emit(ServerEvents.RoomDeleted, roomId);
    this.server.in(roomId).socketsLeave(roomId);
  }

  @SubscribeMessage(ClientEvents.JoinRoom)
  handleJoinRoom(client: SocketWithAuth, roomId: string) {
    this.logger.debug(`⚡️ ${client.user.username} joined room ${roomId}`);
    client.join(roomId);
    this.roomsService.joinRoom(roomId, client.user);
    const usersInRoom = this.roomsService
      .getRoomUsers(roomId)
      .filter((user) => user.id !== client.user.id);

    this.server.to(roomId).emit(Events.AllUsers, usersInRoom);
    this.server.to(roomId).emit(ServerEvents.onRoomJoined, client.user);
  }

  @SubscribeMessage(ClientEvents.LeaveRoom)
  handleLeaveRoom(client: SocketWithAuth, roomId: string) {
    this.logger.debug(`⚡️ ${client.user.username} left room ${roomId}`);
    client.leave(roomId);
    this.roomsService.leaveRoom(roomId, client.user.id);
    this.server.to(roomId).emit(ServerEvents.onRoomLeft, client.user);
  }

  @SubscribeMessage(Events.SendingSignal)
  handleSendingSignal(client: SocketWithAuth, message: SignalMessage) {
    this.logger.debug(
      `⚡️ ${client.user.username} sending signal to ${message.toUserId}`
    );
    const recepient = this.sessions.getUserSocket(message.toUserId);
    this.server.to(recepient.id).emit(ServerEvents.RoomJoined, message);
  }

  @SubscribeMessage(Events.ReturningSignal)
  handleReturningSignal(client: SocketWithAuth, message: SignalMessage) {
    this.logger.debug(
      `⚡️ ${client.user.username} returning signal ${message.toUserId}`
    );

    const recepient = this.sessions.getUserSocket(message.toUserId);
    this.server.to(recepient.id).emit(Events.RecievingReturnedSignal, message);
  }
}
