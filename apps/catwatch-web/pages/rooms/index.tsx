import { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { useCopyToClipboard } from '@catstack/shared/hooks';
import { useCreateRoomMutation } from '@catstack/catwatch/data-access';
import { withAuth } from '@catstack/catwatch/features/auth';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Input,
  Layout,
  toast,
} from '@catstack/shared/vanilla';

const JoinRoomForm = () => {
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

export interface CreateRoomFormProps {
  handleCreateRoomClick: () => void;
}

const CreateRoom = () => {
  const router = useRouter();
  const [createRoom] = useCreateRoomMutation();
  const { copy } = useCopyToClipboard();

  const handleCreateRoomClick = async () => {
    const roomId = await createRoom().unwrap();
    const copyPromise = copy(roomId);

    toast.promise(copyPromise, {
      success: 'Copied room id to clipboard',
      loading: 'Copying room id',
      error: 'Failed to copy',
    });

    router.push(`rooms/${roomId}`);
  };

  return <Button onClick={handleCreateRoomClick}>Create room</Button>;
};

const Rooms: NextPage = () => {
  return (
    <Layout header="Rooms">
      <div className="flex gap-4 p-6 bg-white rounded-lg">
        <JoinRoomForm />
        <CreateRoom />
      </div>
    </Layout>
  );
};

export default withAuth(Rooms)();
