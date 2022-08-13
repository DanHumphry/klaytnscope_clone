import { useCallback, useEffect, useState } from 'react';
import { GLOBAL_EVENT_BACKGROUND_CLICK } from 'utils/variables';

const useTap = (initState: boolean): [boolean, (value: boolean) => void] => {
    const [state, setState] = useState(initState);

    const dispatch = useCallback((value: boolean) => setState(value), []);

    useEffect(() => {
        const background = document.getElementById(GLOBAL_EVENT_BACKGROUND_CLICK);

        if (!background) throw `require element with id of "${GLOBAL_EVENT_BACKGROUND_CLICK}"`;

        if (state) background.style.visibility = 'visible';
        else background.style.visibility = 'hidden';

        document.addEventListener(GLOBAL_EVENT_BACKGROUND_CLICK, () => setState(false));

        return () => document.removeEventListener(GLOBAL_EVENT_BACKGROUND_CLICK, () => {});
    }, [state]);

    return [state, dispatch];
};

export default useTap;
