import { webSocketHost } from 'utils/variables';
import WebSocketClientModel from 'socket/websocket.client';

const initialTimerState = {
    wss: typeof window !== 'undefined' ? new WebSocketClientModel(new WebSocket(webSocketHost)) : null,
};

const socketReducer = (state = initialTimerState, { type, payload }: any) => {
    switch (type) {
        default:
            return state;
    }
};

export default socketReducer;
