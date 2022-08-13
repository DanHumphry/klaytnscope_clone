import type { AppProps } from 'next/app';

import Layout from 'components/_layout';
import 'styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    const dispatchEventUseTapHooks = () => document.dispatchEvent(new Event('BackgroundClickEvent'));

    return (
        <>
            <Layout>
                <Component {...pageProps} />
            </Layout>
            <div id="BackgroundClickEvent" onClick={dispatchEventUseTapHooks} />
        </>
    );
}

export default MyApp;
