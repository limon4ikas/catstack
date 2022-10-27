import { Module } from '@nestjs/common';

import { RoomsModule } from '../rooms/rooms.module';
import { SignalingModule } from '../signaling/signaling.module';

@Module({
  imports: [SignalingModule, RoomsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
