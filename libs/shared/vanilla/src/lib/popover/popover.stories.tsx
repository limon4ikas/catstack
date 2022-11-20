import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from '../button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const Story: ComponentMeta<typeof Popover> = {
  component: Popover,
  title: 'components/Popover',
};
export default Story;

const Template: ComponentStory<typeof Popover> = (args) => (
  <Popover>
    <PopoverTrigger>
      <Button>Open</Button>
    </PopoverTrigger>
    <PopoverContent sideOffset={4}>
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <span>Content</span>
      </div>
    </PopoverContent>
  </Popover>
);

export const Primary = Template.bind({});
Primary.args = {};
