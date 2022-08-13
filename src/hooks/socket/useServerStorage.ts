import { useEffect, useState } from 'react';

import { ReceivedServerInitValues, receivedServerInitValues } from 'socket/index.declare';
import wsc from 'socket/websocket.client';

const useServerStorage = <T extends keyof ReceivedServerInitValues>(type: T): ReceivedServerInitValues[T] => {
    if (typeof window === 'undefined' || !wsc) return receivedServerInitValues[type];

    const [state, setState] = useState<ReceivedServerInitValues[T]>(wsc.getServerValue(type));

    useEffect(() => {
        wsc.eventListener(type, () => {
            setState({ ...wsc.getServerValue(type) });
        });

        return () => {
            wsc.removeEventListener(type);
        };
    }, [wsc.isHealthy]);

    return state;
};

export default useServerStorage;
