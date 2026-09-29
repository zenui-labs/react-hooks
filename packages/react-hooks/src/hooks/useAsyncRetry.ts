import {useCallback, useEffect, useRef, useState} from 'react';
import type {AsyncRetryControls, AsyncRetryState} from '../types';
import {useIsMounted} from './useIsMounted';
import {useLatest} from './useLatest';

/**
 * Milliseconds to wait before the next attempt. Pass a function for backoff:
 * it receives the number of the attempt that just failed (1-based) and its error.
 */
export type AsyncRetryDelay = number | ((attempt: number, error: unknown) => number);

/**
 * Run an async function and retry it when it rejects. `maxRetries` is the total number of
 * attempts (as in 2.0), so the function runs at most `maxRetries` times.
 * @example
 * const {data, loading, attempts, execute} = useAsyncRetry(() => fetch('/api').then((r) => r.json()));
 * // Four attempts with exponential backoff between them: 500, 1000, 2000 ms
 * useAsyncRetry(load, true, 4, (attempt) => 250 * 2 ** attempt);
 */
export function useAsyncRetry<T = any>(
    asyncFunction: (...args: any[]) => Promise<T>,
    immediate = true,
    maxRetries = 3,
    retryDelay: AsyncRetryDelay = 1000
): AsyncRetryState<T> & AsyncRetryControls<T> {
    const [state, setState] = useState<AsyncRetryState<T>>({
        loading: immediate,
        error: null,
        data: null,
        attempts: 0,
    });

    const fnRef = useLatest(asyncFunction);
    const settingsRef = useLatest({maxRetries, retryDelay});
    const isMounted = useIsMounted();
    const runRef = useRef(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const wakeRef = useRef<(() => void) | null>(null);

    // Stop the pending retry wait (if any) and mark every in-flight run as stale.
    const cancel = useCallback(() => {
        runRef.current += 1;
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        const wake = wakeRef.current;
        wakeRef.current = null;
        wake?.();
    }, []);

    const wait = useCallback((ms: number) => new Promise<void>((resolve) => {
        wakeRef.current = resolve;
        timerRef.current = setTimeout(() => {
            timerRef.current = null;
            wakeRef.current = null;
            resolve();
        }, ms);
    }), []);

    const execute = useCallback(async (...args: any[]): Promise<T | null> => {
        cancel();
        const run = runRef.current;
        const isCurrent = () => run === runRef.current && isMounted();

        setState({loading: true, error: null, data: null, attempts: 0});

        for (let attempt = 1; ; attempt++) {
            try {
                const result = await fnRef.current(...args);
                if (!isCurrent()) {
                    return null;
                }
                setState({loading: false, error: null, data: result, attempts: attempt});

                return result;
            } catch (error) {
                if (!isCurrent()) {
                    return null;
                }

                const {maxRetries: limit, retryDelay: delay} = settingsRef.current;
                // 2.0 semantics: `maxRetries` is the total attempt count (at least one attempt runs).
                if (attempt >= Math.max(1, limit)) {
                    setState({loading: false, error, data: null, attempts: attempt});

                    return null;
                }

                setState((current) => ({...current, attempts: attempt}));

                const ms = typeof delay === 'function' ? delay(attempt, error) : delay;
                await wait(Number.isFinite(ms) && ms > 0 ? ms : 0);
                if (!isCurrent()) {
                    return null;
                }
            }
        }
    }, [cancel, wait, fnRef, settingsRef, isMounted]);

    const reset = useCallback(() => {
        cancel();
        setState({loading: false, error: null, data: null, attempts: 0});
    }, [cancel]);

    useEffect(() => {
        if (immediate) {
            void execute();
        }

        return cancel;
        // Runs once on mount, like the 2.0 version.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {...state, execute, reset};
}
