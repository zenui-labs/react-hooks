import { useState, useCallback } from 'react';
import type { CounterActions } from '../types';

export function useCounter(initialValue: number = 0): [number, CounterActions] {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount(x => x + 1), []);
  const decrement = useCallback(() => setCount(x => x - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  const set = useCallback((value: number) => setCount(value), []);

  return [count, { increment, decrement, reset, set }];
}