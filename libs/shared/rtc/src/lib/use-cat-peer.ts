import { useRef, useEffect } from 'react';

import { CatPeer } from './cat-peer';

export interface UseCatPeerConfig {
  id: number;
}

export const useCatPeer = (config: UseCatPeerConfig) => {
  const peerRef = useRef<CatPeer | null>(null);

  useEffect(() => {
    peerRef.current = new CatPeer({ userId: config.id });

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
    };
  }, [config.id]);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return peerRef.current!;
};
