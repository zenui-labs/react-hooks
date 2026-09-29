import {DependencyList, useCallback, useEffect, useRef, useState} from 'react';
import type {AsyncControls, AsyncState} from '../types';
import {useIsMounted} from './useIsMounted';
import {useLatest} from './useLatest';

/**
 * Run an async function and track `loading`, `error` and `data`.
 * Only the most recent call can update state, so a slow earlier call never overwrites a newer result.
 * With `immediate`, it runs on mount and again whenever `deps` change.
 * @example
 * const {data, loading, execute} = useAsync((id: number) => getUser(id), false);
 * <button onClick={() => execute(2)}>Load user 2</button>
 */
export function useAsync<T = any, Args extends unknown[] = any[]>(
    asyncFunction: (...args: Args) => Promise<T>,
    immediate: boolean = true,
    deps: DependencyList = []
): AsyncState<T> & AsyncControls<T, Args> {
    const [state, setState] = useState<AsyncState<T>>({
        loading: immediate,
        error: null,
        data: null,
    });

    const fnRef = useLatest(asyncFunction);
    const isMounted = useIsMounted();
    // Incremented on every call and on reset. Results from older calls are ignored.
    const callId = useRef(0);

    const execute = useCallback(async (...args: Args): Promise<T | null> => {
        const id = ++callId.current;
        setState({loading: true, error: null, data: null});

        try {
            const result = await fnRef.current(...args);
            if (isMounted() && id === callId.current) {
                setState({loading: false, error: null, data: result});
            }
            return result;
        } catch (error: unknown) {
            if (isMounted() && id === callId.current) {
                setState({loading: false, error, data: null});
            }
            return null;
        }
    }, [fnRef, isMounted]);

    const reset = useCallback(() => {
        callId.current++;
        setState({loading: false, error: null, data: null});
    }, []);

    useEffect(() => {
        if (immediate) {
            // Immediate mode calls the function without arguments.
            void execute(...([] as unknown as Args));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [immediate, execute, ...deps]);

    return {...state, execute, reset};
}
