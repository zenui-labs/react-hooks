import {useEffect, useState} from 'react';

/**
 * Return `value` only after it has stopped changing for `delay` milliseconds.
 * @example
 * const [query, setQuery] = useState('');
 * const debouncedQuery = useDebounce(query, 400);
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
