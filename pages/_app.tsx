import Layout from 'components/Layout';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { Provider, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { useStore } from 'redux/store';

function MyApp({ Component, pageProps }: AppProps) {
    const store = useStore(pageProps.initialReduxState);
    const wss = store.getState().networkReducer.wss;

    // const { wss } = useSelector((state: RootState) => state.networkReducer);
    const router = useRouter();

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
