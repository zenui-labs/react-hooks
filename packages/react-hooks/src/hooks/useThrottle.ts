import {useEffect, useRef, useState} from 'react';

export function useThrottle<T>(value: T, delay: number = 300) {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const lastRun = useRef<number>(Date.now());

    useEffect(() => {
        const handler = setTimeout(() => {
            if (Date.now() - lastRun.current >= delay) {
                setThrottledValue(value);
                lastRun.current = Date.now();
            }
        }, delay - (Date.now() - lastRun.current));

        return () => clearTimeout(handler);
    }, [value, delay]);

    return throttledValue;
}
