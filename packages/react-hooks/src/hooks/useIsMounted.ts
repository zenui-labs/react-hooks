import {useCallback, useEffect, useRef} from 'react';

/**
 * Return a function that reports whether the component is still mounted.
 * Guard async work with it before calling `setState`.
 */
export function useIsMounted() {
    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    return useCallback(() => mounted.current, []);
}
