export const handlerError = (error: Error) => {
  console.warn(error.name, error.message);
};
