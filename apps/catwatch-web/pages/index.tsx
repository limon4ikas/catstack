import { NextPage } from 'next';

import { withAuth, MainLayout } from '@catstack/catwatch/features/auth';
import {
  StartScreen,
  StartScreenContextProvider,
  CreateRoomContainer,
  JoinRoomFormContainer,
} from '@catstack/catwatch/features/start';

import { Providers } from '../providers';

const context = {
  JoinRoomFormContainer,
  CreateRoomContainer,
};

export const Index: NextPage = () => {
  return (
    <Providers>
      <MainLayout>
        <StartScreenContextProvider value={context}>
          <StartScreen />
        </StartScreenContextProvider>
      </MainLayout>
    </Providers>
  );
};

export default withAuth(Index)();
