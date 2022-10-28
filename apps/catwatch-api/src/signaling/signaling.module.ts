import { Module } from '@nestjs/common';

import { RoomsModule } from '../rooms/rooms.module';
import { SignalingGateway } from './signaling.gateway';
import { GatewaySessionManager } from './signaling.sessions';

@Module({
  imports: [RoomsModule],
  providers: [SignalingGateway, GatewaySessionManager],
  exports: [SignalingGateway],
})
export class SignalingModule {}
