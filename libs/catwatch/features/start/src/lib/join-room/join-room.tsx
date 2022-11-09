import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { useLazyGetIsRoomAvailableQuery } from '@catstack/catwatch/data-access';
import {
  Button,
  Input,
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@catstack/shared/vanilla';

export interface JoinRoomFormValues {
  roomId: string;
}

export const JoinRoomFormContainer = () => {
  const router = useRouter();
  const [getIsRoomAvailable] = useLazyGetIsRoomAvailableQuery();
  const { register, handleSubmit, formState } = useForm<JoinRoomFormValues>({
    defaultValues: { roomId: '1' },
  });

  const handleJoinRoomClick = async (form: JoinRoomFormValues) => {
    try {
      const isAvailable = await getIsRoomAvailable(form.roomId).unwrap();

      if (!isAvailable) return;

      router.push(`rooms/${form.roomId}`);
    } catch (e) {
      console.error(e);
    }
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
