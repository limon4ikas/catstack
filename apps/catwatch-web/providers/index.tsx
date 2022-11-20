import { PropsWithChildren } from 'react';

import { SocketProvider } from '@catstack/catwatch/data-access';
import {
  IMainLayoutContext,
  MainLayoutProvider,
  UserProfileContainer,
} from '@catstack/catwatch/features/auth';

const context: IMainLayoutContext = {
  UserProfileContainer,
};

export const Providers = (props: PropsWithChildren) => {
  return (
    <SocketProvider>
      <MainLayoutProvider value={context}>{props.children}</MainLayoutProvider>
    </SocketProvider>
  );
};
