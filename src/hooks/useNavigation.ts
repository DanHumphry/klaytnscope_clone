import { useCallback, useState } from 'react';

const useNavigation = (initIndex: number, initState: string[]): [string, (nextIndex: number) => void, string[]] => {
    const [state, setState] = useState<string>(initState[initIndex]);

    const dispatch = useCallback((value: number) => setState(initState[value]), []);

    return [state, dispatch, initState];
};

export default useNavigation;
