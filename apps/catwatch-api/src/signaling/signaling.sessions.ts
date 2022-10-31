import { Injectable } from '@nestjs/common';

import { SocketWithAuth } from '@catstack/catwatch/types';

export interface IGatewaySessionManager {
  getUserSocket(id: number): SocketWithAuth | null;
  setUserSocket(id: number, socket: SocketWithAuth): void;
  getSockets(): Map<number, SocketWithAuth>;
  removeUserSocket(id: number): void;
}

@Injectable()
export class GatewaySessionManager implements IGatewaySessionManager {
  private readonly sessions: Map<number, SocketWithAuth> = new Map();

  /**
   * Returns socket for corresponding user id
   * @param id User ID
   * @returns User socket
   */
  getUserSocket(id: number) {
    if (!this.sessions.has(id)) return null;

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
