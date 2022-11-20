const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
    join(__dirname, '../../../apps/catwatch-web/pages/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, '../features/auth/src/lib/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, '../features/room/src/lib/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, '../features/start/src/lib/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, '../../shared/vanilla/src/lib/**/*.{js,ts,jsx,tsx}'),
  ],
  presets: [require('../catwatch-tailwind.config')],
};
