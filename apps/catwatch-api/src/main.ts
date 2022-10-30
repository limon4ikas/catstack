import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';
import { SocketIOAdapter } from './signaling/signaling.adapter';

const GLOBAL_PREFIX = 'api';
const PORT = process.env.PORT || 3333;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));
  app.use(cookieParser());

  await app.listen(PORT);

  Logger.log(
    `🚀 Application is running on: http://localhost:${PORT}/${GLOBAL_PREFIX}`
  );
}

bootstrap();
