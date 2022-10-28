import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RoomsModule } from '../rooms/rooms.module';
import { SignalingModule } from '../signaling/signaling.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SignalingModule,
    RoomsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
