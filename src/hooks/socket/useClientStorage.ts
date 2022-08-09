import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';

import { clientInitValues, ClientInitValues } from 'socket/index.declare';

const useClientStorage = <T extends keyof ClientInitValues>(
    type: T,
): [ClientInitValues[T], (val: ClientInitValues[T]) => void] => {
    const wss = useSelector((store: RootState) => store.networkReducer.wss);
    if (typeof window === 'undefined' || !wss) return [clientInitValues[type], (v) => {}];

    const [state, setState] = useState<ClientInitValues[T]>(wss.getClientValues(type));

    const dispatch = useCallback((val: ClientInitValues[T]) => {
        wss.setClientValues(type, val);
    }, []);

    useEffect(() => {
        document.addEventListener(type, () => {
            setState(wss.getClientValues(type));
        });

        return () => {
            document.removeEventListener(type, () => {});
        };
    }, []);

    return [state, dispatch];
};

export default useClientStorage;
