import { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';

import { wrapper } from '@catstack/catwatch/store';
import { SocketProvider } from '@catstack/catwatch/data-access';
import { Toaster } from '@catstack/shared/vanilla';

import './styles.css';

function CustomApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <>
      <Head>
        <title>Catwatch</title>
      </Head>
      <SocketProvider>
        <Provider store={store}>
          <Component {...props.pageProps} />
          <Toaster position="top-right" />
        </Provider>
      </SocketProvider>
    </>
  );
}

export default CustomApp;
