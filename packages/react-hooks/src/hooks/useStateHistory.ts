import {useCallback, useState} from 'react';
import {useLatest} from './useLatest';

export interface StateHistoryOptions {
    /** Maximum number of entries kept, including the current one. Defaults to 100. */
    capacity?: number;
}

export type StateHistoryAction<T> = T | ((previous: T) => T);

export interface StateHistory<T> {
    /** The value at the current history pointer. */
    state: T;
    /** Push a new value. Drops any redo entries after the pointer. */
    set: (value: StateHistoryAction<T>) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    /** Every recorded value, oldest first. */
    history: readonly T[];
    /** Index of the current value inside `history`. */
    pointer: number;
    /** Jump to any index in `history`. Out of range values are clamped. */
    go: (index: number) => void;
    /** Forget every entry except the current value. */
    clear: () => void;
}

interface HistoryStore<T> {
    history: T[];
    pointer: number;
}

const DEFAULT_CAPACITY = 100;

function normalizeCapacity(capacity: number | undefined) {
    if (capacity === undefined || !Number.isFinite(capacity)) {
        return DEFAULT_CAPACITY;
    }

    return Math.max(1, Math.floor(capacity));
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

/**
 * State with undo and redo. Every `set` records an entry, up to `capacity` entries.
 * @example
 * const {state, set, undo, redo, canUndo} = useStateHistory('');
 * <input value={state} onChange={(e) => set(e.target.value)}/>
 * <button onClick={undo} disabled={!canUndo}>Undo</button>
 */
export function useStateHistory<T>(initial: T | (() => T), options: StateHistoryOptions = {}): StateHistory<T> {
    const [store, setStore] = useState<HistoryStore<T>>(() => ({
        history: [typeof initial === 'function' ? (initial as () => T)() : initial],
        pointer: 0,
    }));
    const capacityRef = useLatest(normalizeCapacity(options.capacity));

    const set = useCallback((value: StateHistoryAction<T>) => {
        setStore((current) => {
            const previous = current.history[current.pointer];
            const next = typeof value === 'function' ? (value as (previous: T) => T)(previous) : value;

            if (Object.is(next, previous)) {
                return current;
            }

            const history = current.history.slice(0, current.pointer + 1);
            history.push(next);

            const overflow = history.length - capacityRef.current;
            if (overflow > 0) {
                history.splice(0, overflow);
            }

            return {history, pointer: history.length - 1};
        });
    }, [capacityRef]);

    const go = useCallback((index: number) => {
        setStore((current) => {
            const pointer = clamp(Math.trunc(index), 0, current.history.length - 1);

            return pointer === current.pointer ? current : {history: current.history, pointer};
        });
    }, []);

    const undo = useCallback(() => {
        setStore((current) => current.pointer > 0
            ? {history: current.history, pointer: current.pointer - 1}
            : current);
    }, []);

    const redo = useCallback(() => {
        setStore((current) => current.pointer < current.history.length - 1
            ? {history: current.history, pointer: current.pointer + 1}
            : current);
    }, []);

    const clear = useCallback(() => {
        setStore((current) => current.history.length === 1
            ? current
            : {history: [current.history[current.pointer]], pointer: 0});
    }, []);

    return {
        state: store.history[store.pointer],
        set,
        undo,
        redo,
        canUndo: store.pointer > 0,
        canRedo: store.pointer < store.history.length - 1,
        history: store.history,
        pointer: store.pointer,
        go,
        clear,
    };
}
