import { CreateRoomContainer } from './create-room';
import { JoinRoomFormContainer } from './join-room';

export const StartScreen = () => {
  return (
    <div className="grid w-full h-full place-items-center">
      <div className="flex gap-8 p-4 bg-white rounded-lg dark:bg-gray-800">
        <JoinRoomFormContainer />
        <CreateRoomContainer />
      </div>
    </div>
  );
};
