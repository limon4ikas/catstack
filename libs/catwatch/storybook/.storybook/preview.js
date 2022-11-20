import { RouterContext } from 'next/dist/shared/lib/router-context'; // next 12

import './styles.css';

export const parameters = {
  layout: 'centered',
  backgrounds: {
    default: 'white',
    values: [
      {
        name: 'white',
        value: 'rgb(243, 244, 246)',
      },
      {
        name: 'dark',
        value: 'rgb(17, 24, 39)',
      },
    ],
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
};
