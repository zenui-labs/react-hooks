import {useEffect, useRef, useState} from 'react';

/**
 * Return `value` at most once every `delay` milliseconds.
 * The first change after a quiet period is applied immediately, and the latest value
 * is always applied at the end of the window, so the result never gets stuck.
 * @example
 * const {y} = useScroll();
 * const throttledY = useThrottle(y, 200);
 */
export function useThrottle<T>(value: T, delay: number = 300): T {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const emitted = useRef<T>(value);
    // Time of the last emitted update. 0 means nothing has been emitted since mount.
    const lastEmit = useRef(0);

    useEffect(() => {
        if (Object.is(value, emitted.current)) return;

        const emit = () => {
            lastEmit.current = Date.now();
            emitted.current = value;
            setThrottledValue(value);
        };

        const elapsed = Date.now() - lastEmit.current;
        if (elapsed >= delay) {
            emit();
            return;
        }

        // Inside the window: schedule the trailing update. A newer value replaces this
        // timer but keeps the same end time, because `elapsed` is measured from lastEmit.
        const timer = setTimeout(emit, delay - elapsed);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return throttledValue;
}
