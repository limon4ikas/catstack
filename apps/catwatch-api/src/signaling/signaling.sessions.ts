import { Injectable } from '@nestjs/common';

import { SocketWithAuth } from '../auth/auth.types';

export interface IGatewaySessionManager {
  getUserSocket(id: number): SocketWithAuth;
  setUserSocket(id: number, socket: SocketWithAuth): void;
  getSockets(): Map<number, SocketWithAuth>;
  removeUserSocket(id: number): void;
}

@Injectable()
export class GatewaySessionManager implements IGatewaySessionManager {
  private readonly sessions: Map<number, SocketWithAuth> = new Map();

  getUserSocket(id: number) {
    return this.sessions.get(id);
  }

  setUserSocket(userId: number, socket: SocketWithAuth) {
    this.sessions.set(userId, socket);
  }

  removeUserSocket(userId: number) {
    this.sessions.delete(userId);
  }

  getSockets(): Map<number, SocketWithAuth> {
    return this.sessions;
  }
}
