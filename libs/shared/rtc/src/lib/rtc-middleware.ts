import { isAnyOf, Middleware } from '@reduxjs/toolkit';

import { userJoined, userLeft } from '@catstack/catwatch/actions';

import { CatPeer } from './cat-peer';

const isUserJoinedOrLeftAction = isAnyOf(userJoined, userLeft);

let pending: CatPeer | null = null;
export const RtcMiddleware: Middleware = (api) => (next) => (action) => {
  const userId = api.getState()?.auth?.user?.id as number;
  const connections = new Map<number, CatPeer>();

  if (!isUserJoinedOrLeftAction(action)) return next(action);

  const remoteId = action.payload.id;
  const isSameId = remoteId === userId;

  if (userJoined.match(action) && isSameId) {
    console.log("I'm joined room");
    pending = new CatPeer({ userId });
    return next(action);
  }

  if (userJoined.match(action) && !isSameId) {
    console.log('Someone joined room');
    if (!pending) return next(action);
    pending.start(remoteId);
    connections.set(remoteId, pending);
    return next(action);
  }

  if (userLeft.match(action) && isSameId) {
    console.log('I left room');
    pending = null;
    return next(action);
  }

  if (userLeft.match(action) && !isSameId) {
    console.log('Someone left room');
    connections.delete(remoteId);
    pending = null;
    return next(action);
  }

  return next(action);
};
