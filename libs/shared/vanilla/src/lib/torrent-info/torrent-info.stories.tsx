import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { TorrenDownloadInfo } from './torrent-info';

const Story: ComponentMeta<typeof TorrenDownloadInfo> = {
  component: TorrenDownloadInfo,
  title: 'components/Torrent Download Info',
};
export default Story;

const Template: ComponentStory<typeof TorrenDownloadInfo> = (args) => (
  <TorrenDownloadInfo {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  downloadSpeed: 0,
  uploadSpeed: 0,
  timeRemaining: 0,
  peers: 0,
  isLoading: false,
  progrees: 0,
};
