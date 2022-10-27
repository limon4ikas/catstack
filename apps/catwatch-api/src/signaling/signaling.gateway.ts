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

@WebSocketGateway({ cors: { origin: '*' } })
export class SignalingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger(Services.SignalingGateway);

  @WebSocketServer()
  server: Server;

  // constructor(private readonly sessions: IGatewaySessionManager) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('room.create')
  handleCreateRoom(client: Socket) {}

  @SubscribeMessage('room.delete')
  handleDeleteRoom(client: Socket) {}

  @SubscribeMessage('room.join')
  handleJoinRoom(client: Socket) {}

  @SubscribeMessage('room.leave')
  handleLeaveRoom(client: Socket) {}
}
