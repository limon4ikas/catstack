import { forwardRef } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

export const Tabs = TabsPrimitive.Root;
export const TabsList = TabsPrimitive.List;
export const TabsContent = TabsPrimitive.Content;

export const TabsTrigger = forwardRef<
  HTMLButtonElement,
  TabsPrimitive.TabsTriggerProps
>((props, ref) => {
  return (
    <TabsPrimitive.Trigger
      {...props}
      className="flex-grow px-3 py-2 text-sm font-medium text-gray-500 transition-colors rounded-md rdx-state-active:bg-indigo-100 rdx-state-active:text-indigo-700 rdx-state-inactive:text-gray-500 rdx-state-inactive:bg-gray-100 rdx-state-inactive:hover:text-gray-700 dark:rdx-state-active:text-white dark:rdx-state-inactive:text-white dark:hover:rdx-state-active:text-white dark:hover:rdx-state-inactive:text-white dark:rdx-state-active:bg-gray-700 dark:rdx-state-inactive:bg-transparent dark:hover:rdx-state-inactive:bg-gray-700"
      ref={ref}
    />
  );
});
