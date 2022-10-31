import type { Socket } from 'socket.io';
import type { Request } from 'express';
import { User } from '@catstack/catwatch/models';

export const enum Strategies {
  Local = 'local',
  Jwt = 'jwt',
  Refresh = 'jwt-refresh',
}

export type UserProfile = Pick<User, 'id' | 'username'>;
export type JwtPayload = UserProfile & { iat: number; exp: number };
export type SocketWithAuth = Socket & { user: UserProfile };
export type RequestWithAuth = Request & { user: UserProfile };
