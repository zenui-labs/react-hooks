import {useCallback} from 'react';
import {useLatest} from './useLatest';

/**
 * Return a function with a stable identity that always calls the latest `callback`.
 * Safe to pass to memoized children or effect dependency arrays.
 */
export function useEventCallback<Args extends unknown[], R>(callback: (...args: Args) => R) {
    const latest = useLatest(callback);

    return useCallback((...args: Args): R => latest.current(...args), [latest]);
}
