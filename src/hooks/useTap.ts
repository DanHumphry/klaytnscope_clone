import { useCallback, useEffect, useState } from 'react';

const useTap = (initState: boolean): [boolean, (value: boolean) => void] => {
    const [state, setState] = useState(initState);

    const dispatch = useCallback((value: boolean) => setState(value), []);

    useEffect(() => {
        const background = document.getElementById('BackgroundClickEvent');

        if (!background) throw 'require element with id of "BackgroundClickEvent"';

        if (state) background.style.visibility = 'visible';
        else background.style.visibility = 'hidden';

        document.addEventListener('BackgroundClickEvent', () => setState(false));

        return () => document.removeEventListener('BackgroundClickEvent', () => {});
    }, [state]);

    return [state, dispatch];
};

export default useTap;
