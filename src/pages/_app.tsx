import Layout from 'components/_layout';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { Provider } from 'react-redux';
import { useStore } from 'redux/store';

import 'styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    const store = useStore(pageProps.initialReduxState);
    const router = useRouter();

    const wss = store.getState().networkReducer.wss;
    const history: string[] = useMemo(() => [], []);

    useEffect(() => {
        if (history.length !== 0) {
            const prevPath = history[history.length - 1];
            const currentPath = router.pathname;

            if (prevPath === '/' && currentPath !== '/') {
                wss?.sendMessage('leaveRooms');
                console.log('require leave rooms');
            } else if (currentPath === '/') {
                wss?.sendMessage('enterRooms');
                console.log('require enter rooms');
            }
        }

        history.push(router.pathname);
    }, [router.pathname]);

    return (
        <Provider store={store}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </Provider>
    );
}

export default MyApp;
