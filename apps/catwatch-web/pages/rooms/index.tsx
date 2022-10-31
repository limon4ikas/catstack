import { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { useCopyToClipboard } from '@catstack/shared/hooks';
import { useCreateRoomMutation } from '@catstack/catwatch/data-access';
import { withAuth } from '@catstack/catwatch/features/auth';
import { Button, Input, Layout, toast } from '@catstack/shared/vanilla';

export interface JoinRoomFormProps {
  onJoinRoomSubmit: (roomId: string) => void;
}

const JoinRoomForm = (props: JoinRoomFormProps) => {
  const [roomId, setRoomId] = useState('');

  const handleSubmit = () => props.onJoinRoomSubmit(roomId);

  return (
    <div className="flex items-center gap-4">
      <Input
        type="text"
        placeholder="Room ID"
        onChange={(e) => setRoomId(e.target.value)}
      />
      <Button onClick={handleSubmit}>Join room</Button>
    </div>
  );
};

const JoinRoomContainer = () => {
  const router = useRouter();
  const handleJoinRoomClick = async (roomId: string) => {
    router.push(`rooms/${roomId}`);
  };

  return <JoinRoomForm onJoinRoomSubmit={handleJoinRoomClick} />;
};

export interface CreateRoomFormProps {
  handleCreateRoomClick: () => void;
}

const CreateRoomForm = (props: CreateRoomFormProps) => {
  return <Button onClick={props.handleCreateRoomClick}>Create room</Button>;
};

const CreateRoomContainer = () => {
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

  return <CreateRoomForm handleCreateRoomClick={handleCreateRoomClick} />;
};

const Rooms: NextPage = () => {
  return (
    <Layout header="Rooms">
      <div className="flex flex-col gap-4 p-6 bg-white rounded-lg">
        <JoinRoomContainer />
        <CreateRoomContainer />
      </div>
    </Layout>
  );
};

export default withAuth(Rooms)();
