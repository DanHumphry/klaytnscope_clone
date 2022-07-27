import { webSocketHost } from 'utils/variables';
import WebSocketClientModel from 'socket/websocket.client';
import * as types from 'redux/action/types';

const initialTimerState = {
    wss: typeof window !== 'undefined' ? new WebSocketClientModel(new window.WebSocket(webSocketHost)) : null,
    blockHeader: {},
};

const networkReducer = (state = initialTimerState, { type, payload }: any) => {
    switch (type) {
        case types.SET_BLOCK_HEADER:
            return {
                ...state,
                blockHeader: payload.blockHeader,
            };
        default:
            return state;
    }
};

export default networkReducer;
