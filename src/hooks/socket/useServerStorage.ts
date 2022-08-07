import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { ReceivedServerInitValues } from 'socket/index.declare';

const useServerStorage = <T extends keyof ReceivedServerInitValues>(type: T): ReceivedServerInitValues[T] => {
    const wss = useSelector((store: RootState) => store.networkReducer.wss);

    const [state, setState] = useState<ReceivedServerInitValues[T]>(wss.getServerValue(type));

    useEffect(() => {
        wss.eventListener(type, () => {
            setState(wss.getServerValue(type));
        });

        return () => {
            wss.removeEventListener(type);
        };
    }, []);

    return state;
};

export default useServerStorage;
