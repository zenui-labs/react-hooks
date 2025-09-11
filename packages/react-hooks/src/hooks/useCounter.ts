import {useCallback, useState} from 'react';

export function useCounter(initialValue: number = 0) {
    const [count, setCount] = useState(initialValue);

    const increment = useCallback(() => setCount(x => x + 1), []);
    const decrement = useCallback(() => setCount(x => x - 1), []);
    const reset = useCallback(() => setCount(initialValue), [initialValue]);
    const set = useCallback((value: number) => setCount(value), []);

    return {count, increment, decrement, reset, set};
}