import * as types from '../types';

// request action -> suc action or fail action (thunk 쓰는 이유)
export const setNetwork = (payload: { selectedNetwork: string; othersNetworks: string[] }) => (dispatch: any) => {
    dispatch({ type: types.SET_NETWORK, payload: payload });
};

export const setSocket = (_wss: WebSocket) => (dispatch: any) => {
    dispatch({ type: types.INIT_WEBSOCKET, payload: { wss: _wss } });
};
