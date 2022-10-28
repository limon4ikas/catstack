import { Socket } from 'socket.io';

import { User } from '../users/entities/user.entity';

export const enum Strategies {
  Local = 'local',
  Jwt = 'jwt',
}

export type SocketWithAuth = Socket & { user: AuthPayload };

export type RequestWithAuth = Request & { user: AuthPayload };

export type AuthPayload = Omit<User, 'password'>;

export type JwtPayload = {
  username: AuthPayload['username'];
  sub: AuthPayload['userId'];
};
