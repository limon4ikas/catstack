import { NextPage } from 'next';

import { withAuth, MainLayout } from '@catstack/catwatch/features/auth';
import {
  StartScreen,
  StartScreenContextProvider,
  CreateRoomContainer,
  JoinRoomFormContainer,
} from '@catstack/catwatch/features/start';

const context = {
  JoinRoomFormContainer,
  CreateRoomContainer,
};

export const Index: NextPage = () => {
  return (
    <MainLayout>
      <StartScreenContextProvider value={context}>
        <StartScreen />
      </StartScreenContextProvider>
    </MainLayout>
  );
};

export default withAuth(Index)();
