import { Module } from '@nestjs/common';

import { RoomsModule } from '../rooms/rooms.module';
import { EventsModule } from '../signaling/signaling.module';

@Module({
  imports: [EventsModule, RoomsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
