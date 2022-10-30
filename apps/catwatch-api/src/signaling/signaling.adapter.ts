import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

import { JwtPayload, SocketWithAuth } from '@catstack/catwatch/types';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);

  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const jwtService = this.app.get(JwtService);
    const server: Server = super.createIOServer(port, options);

    server.use(createTokenMiddleware(jwtService, this.logger));

    return server;
  }
}

const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger) =>
  (socket: SocketWithAuth, next: (err?: ExtendedError) => void) => {
    const cookies: { accessToken?: string; refreshToken?: string } =
      socket.handshake.headers.cookie.split(';').reduce(
        (cookies, cookieStr) => ({
          ...cookies,
          [cookieStr.split('=')[0].trim()]: cookieStr.split('=')[1].trim(),
        }),
        {}
      );

    // for Postman testing support, fallback to token header
    const token =
      cookies.accessToken || (socket.handshake.headers['token'] as string);

    logger.debug(`Validating auth token before connection: ${token}`);

    try {
      const { iat, exp, ...user }: JwtPayload = jwtService.verify(token);

      socket.user = user;

      next();
    } catch {
      logger.debug('Validating auth token failed');
      next(new Error('Forbidden!'));
    }
  };
