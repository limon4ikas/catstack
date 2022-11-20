import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { UserProfile } from '../user-profile';

import { MainLayout } from './main-layout';

import { IMainLayoutContext, MainLayoutProvider } from './main-layout.context';

const Story: ComponentMeta<typeof MainLayout> = {
  component: MainLayout,
  title: 'screens/Main Layout',
  parameters: { layout: 'padded' },
};
export default Story;

const context: IMainLayoutContext = {
  UserProfileContainer: () => (
    <UserProfile username="limonikas" isSocketConnected={true} />
  ),
};

export const Primary: ComponentStory<typeof MainLayout> = (args) => (
  <MainLayoutProvider value={context}>
    <MainLayout {...args} />
  </MainLayoutProvider>
);
