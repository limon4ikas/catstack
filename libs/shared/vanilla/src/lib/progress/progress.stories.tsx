import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { ProgressBar } from './progress';

const Story: ComponentMeta<typeof ProgressBar> = {
  component: ProgressBar,
  title: 'components/Progress Bar',
  parameters: { layout: 'padded' },
};
export default Story;

const Template: ComponentStory<typeof ProgressBar> = (args) => (
  <ProgressBar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  max: 100,
  value: 47,
};
