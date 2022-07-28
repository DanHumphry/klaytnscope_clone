import Layout from 'components/_layout';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { Provider } from 'react-redux';
import { useStore } from 'redux/store';

import 'styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    const store = useStore(pageProps.initialReduxState);
    const path = useRouter().pathname;

    const history: string[] = useMemo(() => [], []);

    useEffect(() => {
        const wss = store.getState().networkReducer.wss;

        if (history.length !== 0) {
            const prevPath = history[history.length - 1];
            const currentPath = path;

            if (prevPath === '/' && currentPath !== '/') wss?.sendMessage('leaveRooms');
            else if (currentPath === '/') wss?.sendMessage('enterRooms');
        }

        history.push(path);
    }, [path]);

    return (
        <Provider store={store}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
            <div id="BackgroundClickEvent" onClick={() => document.dispatchEvent(new Event('BackgroundClickEvent'))} />
        </Provider>
    );
}

export default MyApp;
