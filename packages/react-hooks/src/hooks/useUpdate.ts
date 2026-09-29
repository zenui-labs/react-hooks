import {useCallback, useState} from 'react';

/**
 * Return a stable function that forces the component to re-render.
 * @example
 * const update = useUpdate();
 * <button onClick={update}>Re-render</button>
 */
export function useUpdate(): () => void {
    const [, setTick] = useState(0);

    return useCallback(() => {
        setTick(tick => tick + 1);
    }, []);
}
