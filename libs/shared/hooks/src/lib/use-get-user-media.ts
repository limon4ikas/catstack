import { useCallback } from 'react';

export const useUserMedia = () => {
  const getMedia = useCallback(async (constraints?: MediaStreamConstraints) => {
    return await navigator.mediaDevices.getUserMedia(constraints);
  }, []);

  return { getMedia };
};
