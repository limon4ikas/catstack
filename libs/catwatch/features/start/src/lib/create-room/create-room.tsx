import { useRouter } from 'next/router';

import { useCreateRoomMutation } from '@catstack/catwatch/data-access';
import { useCopyToClipboard } from '@catstack/shared/hooks';
import { Button, toast } from '@catstack/shared/vanilla';

export interface CreateRoomFormProps {
  handleCreateRoomClick: () => void;
}

export const CreateRoomContainer = () => {
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
