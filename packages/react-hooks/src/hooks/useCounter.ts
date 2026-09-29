import {useCallback, useState} from 'react';
import type {CounterActions, CounterOptions} from '../types';
import {useLatest} from './useLatest';

function clamp(value: number, {min, max}: CounterOptions): number {
    let next = value;
    if (typeof max === 'number' && next > max) next = max;
    if (typeof min === 'number' && next < min) next = min;
    return next;
}

/**
 * Hold a number with stable increment, decrement, set and reset helpers.
 * Pass `min`, `max` and `step` to clamp the value and change the step size.
 * @example
 * const {count, increment, decrement} = useCounter(1, {min: 1, max: 10});
 * <button onClick={increment}>{count}</button>
 */
export function useCounter(initialValue: number = 0, options: CounterOptions = {}): CounterActions {
    const [count, setCount] = useState(() => clamp(initialValue, options));
    const initialRef = useLatest(initialValue);
    const optionsRef = useLatest(options);

    const increment = useCallback(() => {
        setCount(x => clamp(x + (optionsRef.current.step ?? 1), optionsRef.current));
    }, [optionsRef]);
    const decrement = useCallback(() => {
        setCount(x => clamp(x - (optionsRef.current.step ?? 1), optionsRef.current));
    }, [optionsRef]);
    const reset = useCallback(() => {
        setCount(clamp(initialRef.current, optionsRef.current));
    }, [initialRef, optionsRef]);
    const set = useCallback((value: number) => {
        setCount(clamp(value, optionsRef.current));
    }, [optionsRef]);

    return {count, increment, decrement, reset, set};
}
