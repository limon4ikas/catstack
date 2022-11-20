import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from '../button';

import { ConfirmDialog } from './alert-dialog';

const Story: ComponentMeta<typeof ConfirmDialog> = {
  component: ConfirmDialog,
  title: 'components/Confirm Dialog',
};
export default Story;

const Template: ComponentStory<typeof ConfirmDialog> = (args) => (
  <ConfirmDialog {...args}>
    <Button>Open</Button>
  </ConfirmDialog>
);

export const Primary = Template.bind({});
Primary.args = {
  title: 'New video file',
  description:
    'User suggested to download torrent file for media playback, do you want to continue?',
  defaultOpen: false,
};
