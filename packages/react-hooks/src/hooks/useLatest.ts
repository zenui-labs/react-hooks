import {useRef} from 'react';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

/**
 * Keep a ref that always points at the latest value.
 * Read it inside effects, timers and event listeners to avoid stale closures
 * without adding the value to dependency arrays.
 */
export function useLatest<T>(value: T) {
    const ref = useRef(value);

    useIsomorphicLayoutEffect(() => {
        ref.current = value;
    });

    return ref;
}
