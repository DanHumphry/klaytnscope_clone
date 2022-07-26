import { useCallback, useEffect, useState } from 'react';

import { clientInitValues, ClientInitValues } from 'socket/index.declare';
import wsc from 'socket/websocket.client';

const useClientStorage = <T extends keyof ClientInitValues>(
    type: T,
): [ClientInitValues[T], (val: ClientInitValues[T]) => void] => {
    if (typeof window === 'undefined' || !wsc) return [clientInitValues[type], (v) => {}];

    const [state, setState] = useState<ClientInitValues[T]>(wsc.getClientValues(type));

    const dispatch = useCallback(
        (val: ClientInitValues[T]) => {
            if (wsc) wsc.setClientValues(type, val);
        },
        [wsc.isHealthy],
    );

    useEffect(() => {
        document.addEventListener(type, () => {
            if (wsc) setState({ ...wsc.getClientValues(type) });
        });

        return () => {
            document.removeEventListener(type, () => {});
        };
    }, [wsc.isHealthy]);

    return [state, dispatch];
};

export default useClientStorage;
