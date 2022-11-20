import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { FileDropZone } from './file-drop-zone';

const Story: ComponentMeta<typeof FileDropZone> = {
  component: FileDropZone,
  title: 'components/File Drop Zone',
  parameters: { layout: 'padded' },
};
export default Story;

const Template: ComponentStory<typeof FileDropZone> = (args) => (
  <FileDropZone {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
