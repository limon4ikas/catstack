const rootMain = require('../../../../.storybook/main');

module.exports = {
  ...rootMain,

  core: { ...rootMain.core, builder: 'webpack5' },

  refs: { vanilla: { title: 'Vanilla', url: 'http://localhost:4401' } },

  stories: [
    ...rootMain.stories,
    '../../../../apps/catwatch-web/pages/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../../apps/catwatch-web/components/**/*.stories.@(js|jsx|ts|tsx)',
    '../../features/start/src/lib/**/*.stories.@(js|jsx|ts|tsx)',
    '../../features/auth/src/lib/**/*.stories.@(js|jsx|ts|tsx)',
    '../../features/room/src/lib/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [...rootMain.addons, '@nrwl/react/plugins/storybook'],
  webpackFinal: async (config, { configType }) => {
    // apply any global webpack configs that might have been specified in .storybook/main.js
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, { configType });
    }

    // add your own webpack tweaks if needed

    return config;
  },
};
