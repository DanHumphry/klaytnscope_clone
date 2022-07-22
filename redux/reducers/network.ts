import WebSocketClientModel from 'utils/websocket.client';
import * as types from 'redux/types';

const initialTimerState = {
    selectedNetwork: 'Baobab',
    othersNetworks: ['Main'],
    wss: null,
};

const networkReducer = (state = initialTimerState, { type, payload }: any) => {
    switch (type) {
        case types.SET_NETWORK:
            return {
                ...state,
                selectedNetwork: payload.selectedNetwork,
                othersNetworks: payload.othersNetworks,
            };
        case types.INIT_WEBSOCKET:
            return {
                ...state,
                wss: new WebSocketClientModel(payload.wss),
            };
        default:
            return state;
    }
};

export default networkReducer;
