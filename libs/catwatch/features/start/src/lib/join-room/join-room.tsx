import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import {
  Button,
  Input,
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@catstack/shared/vanilla';
import { useLazyGetIsRoomExistsQuery } from '@catstack/catwatch/data-access';

export interface JoinRoomFormValues {
  roomId: string;
}

export const JoinRoomFormContainer = () => {
  const router = useRouter();
  const [getIsRoomAvailable] = useLazyGetIsRoomExistsQuery();
  const { register, handleSubmit, formState } = useForm<JoinRoomFormValues>({
    defaultValues: { roomId: '1' },
  });

  const handleJoinRoomClick = async (form: JoinRoomFormValues) => {
    const isAvailable = await getIsRoomAvailable(form.roomId).unwrap();

    if (!isAvailable) return;

    router.push(`rooms/${form.roomId}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Join room</Button>
      </DialogTrigger>
      <DialogContent>
        <form
          className="flex items-center gap-4"
          onSubmit={handleSubmit(handleJoinRoomClick)}
        >
          <Input
            label="Join room"
            type="text"
            placeholder="Room ID"
            {...register('roomId')}
          />
          <Button type="submit">
            {formState.isSubmitting ? 'Joining' : 'Join'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
