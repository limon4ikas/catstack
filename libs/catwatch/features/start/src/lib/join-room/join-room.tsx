import { FC } from 'react';
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
  onSubmit?: (values: JoinRoomFormValues) => void;
}

export const JoinRoomForm = (props: JoinRoomFormProps) => {
  const { register, handleSubmit } = useForm<JoinRoomFormValues>({
    defaultValues: { roomId: '1' },
  });

  return (
    <form
      className="flex items-center gap-4"
      onSubmit={handleSubmit((form: JoinRoomFormValues) =>
        props.onSubmit?.(form)
      )}
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

export interface JoinRoomProps {
  onJoinRoomSubmit?: (form: JoinRoomFormValues) => void;
}

export const JoinRoom = (props: JoinRoomProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Join room</Button>
      </DialogTrigger>
      <DialogContent>
        <JoinRoomForm onSubmit={props.onJoinRoomSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export interface JoinRoomFormValues {
  roomId: string;
}

export const JoinRoomFormContainer: FC = () => {
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

  return <JoinRoom onJoinRoomSubmit={handleJoinRoomSubmit} />;
};
