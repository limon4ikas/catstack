import type { Socket } from 'socket.io';
import type { Request } from 'express';
import { User } from '@catstack/catwatch/models';

export const enum Strategies {
  Local = 'local',
  Jwt = 'jwt',
}

export type AuthPayload = Pick<User, 'id' | 'username'>;
export type JwtPayload = AuthPayload & { iat: number; exp: number };
export type SocketWithAuth = Socket & { user: AuthPayload };
export type RequestWithAuth = Request & { user: AuthPayload };
