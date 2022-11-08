import { CreateRoomContainer } from './create-room';
import { JoinRoomFormContainer } from './join-room';

export const StartScreen = () => {
  return (
    <div className="grid h-full place-items-center">
      <div className="flex gap-8 p-4 bg-white rounded-lg">
        <JoinRoomFormContainer />
        <CreateRoomContainer />
      </div>
    </div>
  );
};
