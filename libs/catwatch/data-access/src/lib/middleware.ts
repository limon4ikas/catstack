import { createListenerMiddleware } from '@reduxjs/toolkit';
import { userJoined } from './actions';

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: userJoined,
  effect: (action, api) => {
    // console.log(action.payload);
  },
});
