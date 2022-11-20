import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Input } from './input';

const Story: ComponentMeta<typeof Input> = {
  component: Input,
  title: 'components/Input',
};
export default Story;

const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Label',
};
