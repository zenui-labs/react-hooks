import {useCallback, useState} from 'react';
import type {ToggleResult} from '../types';
import {useLatest} from './useLatest';

/**
 * Hold a boolean with stable helpers to flip, set and reset it.
 * @example
 * const {value: isOpen, toggle, setFalse: close} = useToggle();
 * <button onClick={toggle}>{isOpen ? 'Hide' : 'Show'}</button>
 */
export function useToggle(initialValue: boolean = false): ToggleResult {
    const [value, setValue] = useState(initialValue);
    const initialRef = useLatest(initialValue);

    const toggle = useCallback(() => setValue(v => !v), []);
    const setTrue = useCallback(() => setValue(true), []);
    const setFalse = useCallback(() => setValue(false), []);
    const set = useCallback((next: boolean) => setValue(Boolean(next)), []);
    const reset = useCallback(() => setValue(initialRef.current), [initialRef]);

    return {value, toggle, setTrue, setFalse, set, reset};
}
