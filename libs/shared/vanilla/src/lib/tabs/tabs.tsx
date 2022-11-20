import { forwardRef } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cva } from '@catstack/shared/utils';

export const Tabs = TabsPrimitive.Root;
export const TabsList = TabsPrimitive.List;
export const TabsContent = TabsPrimitive.Content;

const tabsTriggerStyles = cva([
  'flex-grow',
  'px-3',
  'py-3',
  'text-sm',
  'font-medium',
  'text-gray-500',
  'transition-colors',
  'rdx-state-inactive:bg-gray-100',
  'rdx-state-inactive:text-gray-500',
  'rdx-state-inactive:hover:text-gray-900 rdx-state-inactive:hover:bg-gray-200',
  'rdx-state-active:text-indigo-900',
  'rdx-state-active:bg-indigo-100',
  'rdx-state-active:hover:bg-indigo-200',
  'dark:rdx-state-active:text-white',
  'dark:rdx-state-inactive:text-white',
  'dark:hover:rdx-state-active:text-white',
  'dark:hover:rdx-state-inactive:text-white',
  'dark:rdx-state-active:bg-gray-700',
  'dark:rdx-state-inactive:bg-transparent',
  'dark:hover:rdx-state-inactive:bg-gray-700',
]);

export const TabsTrigger = forwardRef<
  HTMLButtonElement,
  TabsPrimitive.TabsTriggerProps
>((props, ref) => {
  return (
    <TabsPrimitive.Trigger
      {...props}
      className={tabsTriggerStyles()}
      ref={ref}
    />
  );
});
