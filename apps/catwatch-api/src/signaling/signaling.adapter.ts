import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';

import { SocketWithAuth } from '../auth/auth.types';

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
  (socket: SocketWithAuth, next) => {
    // for Postman testing support, fallback to token header
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    logger.debug(`Validating auth token before connection: ${token}`);

    try {
      // { username: 'john', sub: 1, iat: 1666957344, exp: 1666957584 }
      const payload = jwtService.verify(token);

      socket.user = {
        userId: payload.sub,
        username: payload.username,
      };

      next();
    } catch {
      logger.debug('Validating auth token failed');
      next(new Error('Forbidden!'));
    }
  };
