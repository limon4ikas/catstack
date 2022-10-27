import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { Services } from '../constants';
import { RoomsService } from '../rooms/rooms.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class SignalingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(Services.SignalingGateway);
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomsService: RoomsService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    this.roomsService.getAllRooms().forEach((room) => {
      if (room.sockets.has(client.id)) {
        this.logger.log(`Removed ${client.id} from room ${room.id}`);
        room.removeSocket(client.id);
      }
    });
  }

  @SubscribeMessage('room.join')
  handleCreateRoom(client: Socket, roomId: string) {
    this.roomsService.joinRoom(roomId, client.id);

    client.join(roomId);

    this.server.to(roomId).emit('user-joined-room', client.id);
  }

  @SubscribeMessage('room.leave')
  handleLeaveRoom(client: Socket, roomId: string) {
    this.roomsService.leaveRoom(roomId, client.id);

    client.leave(roomId);

    this.server.to(roomId).emit('user-left-room', client.id);
  }
}
