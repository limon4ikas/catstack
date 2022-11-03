import type { Socket } from 'socket.io';
import type { Request } from 'express';

import { UserProfile } from './user';

export const enum Strategies {
  Local = 'local',
  Jwt = 'jwt',
  Refresh = 'jwt-refresh',
}

export type JwtPayload = UserProfile & { iat: number; exp: number };
export type SocketWithAuth = Socket & { user: UserProfile };
export type RequestWithAuth = Request & { user: UserProfile };
