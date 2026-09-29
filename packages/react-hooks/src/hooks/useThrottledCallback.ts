import {useDebouncedCallback, type DebouncedFunction} from './useDebouncedCallback';

export interface ThrottledCallbackOptions {
    /** Call on the first event of a burst. Defaults to true. */
    leading?: boolean;
    /** Call once more at the end of the interval with the latest arguments. Defaults to true. */
    trailing?: boolean;
}

export type ThrottledFunction<Args extends unknown[]> = DebouncedFunction<Args>;

/**
 * Throttle a callback: it runs at most once per `interval` while calls keep coming.
 * Stable identity, latest `fn`, timer cleared on unmount.
 * @example
 * const onScroll = useThrottledCallback(() => setY(window.scrollY), 100);
 * useEffect(() => { window.addEventListener('scroll', onScroll); return () => window.removeEventListener('scroll', onScroll); }, [onScroll]);
 */
export function useThrottledCallback<Args extends unknown[]>(
    fn: (...args: Args) => void,
    interval: number,
    options: ThrottledCallbackOptions = {}
): ThrottledFunction<Args> {
    // A throttle is a debounce whose maxWait equals its wait.
    return useDebouncedCallback(fn, interval, {
        leading: options.leading ?? true,
        trailing: options.trailing ?? true,
        maxWait: interval,
    });
}
