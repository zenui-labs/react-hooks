import {useEffect, useRef} from 'react';

/**
 * Return the value from the previous render, or `undefined` on the first render.
 * @example
 * const [count, setCount] = useState(0);
 * const previous = usePrevious(count);
 */
export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}
