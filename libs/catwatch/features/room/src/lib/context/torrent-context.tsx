import { createContext, PropsWithChildren, useRef, useContext } from 'react';
import type { Instance } from 'webtorrent';

import { useEffectOnce } from '@catstack/shared/hooks';

const TorrentContext = createContext<Instance | null>(null);

export const TorrentContextProvider = (props: PropsWithChildren) => {
  const clientRef = useRef<Instance | null>(null);

  useEffectOnce(() => {
    (async () => {
      if (!clientRef.current) {
        const WebTorrent = (await import('webtorrent')).default;
        clientRef.current = new WebTorrent();
      }
    })();

    return () => {
      if (clientRef.current) {
        clientRef.current.destroy(console.error);
      }
    };
  });

  if (!clientRef.current) return null;

  return (
    <TorrentContext.Provider value={clientRef.current}>
      {props.children}
    </TorrentContext.Provider>
  );
};

export const useTorrentClient = () => {
  const context = useContext(TorrentContext);

  if (!context) throw new Error('No torrent client found');

  return context;
};
