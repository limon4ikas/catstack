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

export interface JoinRoomFormProps {
  onSubmit: (values: JoinRoomFormValues) => void;
}

export const JoinRoomForm = (props: JoinRoomFormProps) => {
  const { register, handleSubmit } = useForm<JoinRoomFormValues>({
    defaultValues: { roomId: '1' },
  });

  return (
    <form
      className="flex items-center gap-4"
      onSubmit={handleSubmit(props.onSubmit)}
    >
      <Input
        label="Join room"
        type="text"
        placeholder="Room ID"
        {...register('roomId')}
      />
      <Button type="submit">Join</Button>
    </form>
  );
};

export interface JoinRoomFormValues {
  roomId: string;
}

export const JoinRoomFormContainer = () => {
  const router = useRouter();
  const [getIsRoomAvailable] = useLazyGetIsRoomAvailableQuery();

  const handleJoinRoomSubmit = async (form: JoinRoomFormValues) => {
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
        <JoinRoomForm onSubmit={handleJoinRoomSubmit} />
      </DialogContent>
    </Dialog>
  );
};
