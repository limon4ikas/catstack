import { useState } from 'react';
import { useRouter } from 'next/router';

import {
  Button,
  Input,
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@catstack/shared/vanilla';

export const JoinRoomFormContainer = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState('1');

  const handleJoinRoomClick = async () => {
    router.push(`rooms/${roomId}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Join room</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex items-center gap-4">
          <Input
            label="Join room"
            type="text"
            placeholder="Room ID"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
          />
          <Button onClick={handleJoinRoomClick}>Join</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
