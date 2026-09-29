import {useEffect, useRef} from 'react';
import {useLatest} from './useLatest';

export interface DebouncedCallbackOptions {
    /** Call on the leading edge of the wait. Defaults to false. */
    leading?: boolean;
    /** Call on the trailing edge with the latest arguments. Defaults to true. */
    trailing?: boolean;
    /** Longest time a call can be delayed. Unset means no limit. */
    maxWait?: number;
}

export interface DebouncedFunction<Args extends unknown[]> {
    (...args: Args): void;
    /** Drop the scheduled call. */
    cancel: () => void;
    /** Run the scheduled call now, if there is one. */
    flush: () => void;
    /** True when a trailing call is scheduled. */
    isPending: () => boolean;
}

type Timer = ReturnType<typeof setTimeout>;

/**
 * Debounce a callback. The returned function keeps its identity for the life of the component,
 * always calls the latest `fn`, and cancels its timer on unmount.
 * @example
 * const search = useDebouncedCallback((q: string) => fetchResults(q), 300, {maxWait: 1000});
 * <input onChange={(e) => search(e.target.value)} onBlur={search.flush}/>
 */
export function useDebouncedCallback<Args extends unknown[]>(
    fn: (...args: Args) => void,
    delay: number,
    options: DebouncedCallbackOptions = {}
): DebouncedFunction<Args> {
    const fnRef = useLatest(fn);
    const settingsRef = useLatest({delay, ...options});
    const debouncedRef = useRef<DebouncedFunction<Args> | null>(null);

    if (debouncedRef.current === null) {
        let timer: Timer | undefined;
        let lastArgs: Args | undefined;
        let lastCallTime: number | undefined;
        let lastInvokeTime = 0;

        const read = () => {
            const s = settingsRef.current;
            const wait = Math.max(0, Number(s.delay) || 0);
            const maxing = s.maxWait !== undefined;

            return {
                wait,
                leading: Boolean(s.leading),
                trailing: s.trailing ?? true,
                maxing,
                maxWait: maxing ? Math.max(Number(s.maxWait) || 0, wait) : 0,
            };
        };

        const invoke = (time: number) => {
            const args = lastArgs as Args;
            lastArgs = undefined;
            lastInvokeTime = time;
            fnRef.current(...args);
        };

        const remainingWait = (time: number) => {
            const {wait, maxing, maxWait} = read();
            const sinceCall = time - (lastCallTime ?? 0);
            const sinceInvoke = time - lastInvokeTime;
            const waiting = wait - sinceCall;

            return maxing ? Math.min(waiting, maxWait - sinceInvoke) : waiting;
        };

        const shouldInvoke = (time: number) => {
            if (lastCallTime === undefined) {
                return true;
            }
            const {wait, maxing, maxWait} = read();
            const sinceCall = time - lastCallTime;
            const sinceInvoke = time - lastInvokeTime;

            return sinceCall >= wait || sinceCall < 0 || (maxing && sinceInvoke >= maxWait);
        };

        const trailingEdge = (time: number) => {
            timer = undefined;
            if (read().trailing && lastArgs) {
                invoke(time);
            }
            lastArgs = undefined;
        };

        const timerExpired = () => {
            const time = Date.now();
            if (shouldInvoke(time)) {
                trailingEdge(time);
                return;
            }
            timer = setTimeout(timerExpired, remainingWait(time));
        };

        const leadingEdge = (time: number) => {
            lastInvokeTime = time;
            timer = setTimeout(timerExpired, read().wait);
            if (read().leading) {
                invoke(time);
            }
        };

        const debounced = ((...args: Args) => {
            const time = Date.now();
            const isInvoking = shouldInvoke(time);

            lastArgs = args;
            lastCallTime = time;

            if (isInvoking) {
                if (timer === undefined) {
                    leadingEdge(time);
                    return;
                }
                if (read().maxing) {
                    clearTimeout(timer);
                    timer = setTimeout(timerExpired, read().wait);
                    invoke(time);
                    return;
                }
            }

            if (timer === undefined) {
                timer = setTimeout(timerExpired, read().wait);
            }
        }) as DebouncedFunction<Args>;

        debounced.cancel = () => {
            if (timer !== undefined) {
                clearTimeout(timer);
            }
            timer = undefined;
            lastArgs = undefined;
            lastCallTime = undefined;
            lastInvokeTime = 0;
        };

        debounced.flush = () => {
            if (timer !== undefined) {
                clearTimeout(timer);
                trailingEdge(Date.now());
            }
        };

        debounced.isPending = () => timer !== undefined && lastArgs !== undefined && read().trailing;

        debouncedRef.current = debounced;
    }

    useEffect(() => {
        const debounced = debouncedRef.current;

        return () => debounced?.cancel();
    }, []);

    return debouncedRef.current;
}
