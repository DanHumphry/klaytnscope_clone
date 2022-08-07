import { useMemo } from 'react';
import { createStore, applyMiddleware, EmptyObject, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from 'redux/reducers';
import WebSocketClientModel from 'socket/websocket.client';

function initStore(initialState: any) {
    return createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)));
}

export const initializeStore = (preloadedState: any) => {
    const store = initStore(preloadedState);

    // // // For SSG and SSR always create a new store
    // if (typeof window === 'undefined') return null;

    return store;
};

export function useStore(initialState: unknown) {
    const store = useMemo(() => initializeStore(initialState), [initialState]);
    return store;
}
