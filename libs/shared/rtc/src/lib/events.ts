export const handlePeerConnection = (label: string) => () => {
  console.log(`⚡️ ${label} from connection established`);
};

export const handlerError = (error: Error) => {
  console.warn(error.name, error.message);
};
