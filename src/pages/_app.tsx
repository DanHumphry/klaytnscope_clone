import type { AppProps } from 'next/app';

import Layout from 'components/_layout';
import 'styles/globals.css';
import { GLOBAL_EVENT_BACKGROUND_CLICK } from 'utils/variables';

function MyApp({ Component, pageProps }: AppProps) {
    const dispatchEventUseTapHooks = () => document.dispatchEvent(new Event(GLOBAL_EVENT_BACKGROUND_CLICK));

    return (
        <>
            <Layout>
                <Component {...pageProps} />
            </Layout>
            <div id={GLOBAL_EVENT_BACKGROUND_CLICK} onClick={dispatchEventUseTapHooks} />
        </>
    );
}

export default MyApp;
