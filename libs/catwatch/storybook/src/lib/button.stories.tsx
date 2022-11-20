import type { ComponentStory, ComponentMeta } from '@storybook/react';

const Button = () => <div>Button</div>;

const Story: ComponentMeta<typeof Button> = {
  component: Button,
  title: 'components/Button',
};
export default Story;

const Template: ComponentStory<typeof Button> = (args) => <Button />;

export const Primary = Template.bind({});
Primary.args = {};
