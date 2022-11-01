import { useRef, useEffect } from 'react';
import { Socket } from 'socket.io-client';

import { CatPeer } from './cat-peer';

export interface UseCatPeerConfig {
  id: number;
  remoteId: number;
  socket: Socket;
}

export const useCatPeer = (config: UseCatPeerConfig) => {
  const peerRef = useRef<CatPeer | null>(null);

  useEffect(() => {
    peerRef.current = new CatPeer({
      userId: config.id,
      remoteUserId: config.id === 1 ? 2 : 1,
      socket: config.socket,
    });
  }, [config.id, config.socket]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return peerRef.current!;
};
