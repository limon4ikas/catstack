import { Module } from '@nestjs/common';

import { RoomsModule } from '../rooms/rooms.module';
import { SignalingGateway } from './signaling.gateway';

@Module({
  imports: [RoomsModule],
  providers: [SignalingGateway],
  exports: [SignalingGateway],
})
export class SignalingModule {}
