import { forwardRef } from 'react';
import * as Progress from '@radix-ui/react-progress';

export type ProgressBarProps = Progress.ProgressProps;

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (props, ref) => {
    return (
      <Progress.Root
        className="relative w-full h-6 overflow-hidden"
        value={props.value}
        ref={ref}
      >
        <Progress.Indicator
          className="bg-indigo-600 w-full h-full transition-[width] duration-700"
          style={{ transform: `translateX(-${100 - (props.value ?? 0)}%)` }}
        />
      </Progress.Root>
    );
  }
);
