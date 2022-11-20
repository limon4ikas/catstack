import { FC } from 'react';
import { useStartScreenProvider } from './start-screen.context';

export const StartScreen: FC = () => {
  const { CreateRoomContainer, JoinRoomFormContainer } =
    useStartScreenProvider();

  return (
    <div className="grid w-full h-full place-items-center">
      <div className="flex gap-8 p-4 bg-white rounded-lg dark:bg-gray-800">
        <JoinRoomFormContainer />
        <CreateRoomContainer />
      </div>
    </div>
  );
};
