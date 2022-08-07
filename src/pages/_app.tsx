import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import Layout from 'components/_layout';
import { useStore } from 'redux/store';
import 'styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    const store = useStore(pageProps.initialReduxState);

    const dispatchEventUseTapHooks = () => document.dispatchEvent(new Event('BackgroundClickEvent'));

    return (
        <Provider store={store}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
            <div id="BackgroundClickEvent" onClick={dispatchEventUseTapHooks} />
        </Provider>
    );
}

export default MyApp;
