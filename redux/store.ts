import { useMemo } from 'react';
import { createStore, applyMiddleware, EmptyObject, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from 'redux/reducers';
import WebSocketClientModel from 'utils/websocket.client';

let store:
    | (Store<
          EmptyObject & {
              networkReducer: { selectedNetwork: any; othersNetworks: any; wss: WebSocketClientModel | null };
          },
          any
      > & { dispatch: unknown })
    | undefined;

function initStore(initialState: any) {
    return createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)));
}

export const initializeStore = (preloadedState: any) => {
    let _store = store ?? initStore(preloadedState);

    // After navigating to a page with an initial Redux state, merge that state
    // with the current state in the store, and create a new store
    if (preloadedState && store) {
        _store = initStore({
            ...store.getState(),
            ...preloadedState,
        });
        // Reset the current store
        store = undefined;
    }

    // For SSG and SSR always create a new store
    if (typeof window === 'undefined') return _store;
    // Create the store once in the client
    if (!store) store = _store;

    return _store;
};

export function useStore(initialState: unknown) {
    const store = useMemo(() => initializeStore(initialState), [initialState]);
    return store;
}
