import {useCallback, useRef, useState} from 'react';
import {useIsMounted} from './useIsMounted';
import {useLatest} from './useLatest';

/**
 * The async work behind an update. It receives the optimistic value. Resolve with the confirmed
 * value from the server, or with `undefined` to keep the optimistic result. Reject to roll back.
 */
export type OptimisticCommit<T> = (optimistic: T) => Promise<T | void>;

export interface OptimisticState<T, A> {
    /** The confirmed value with every pending update applied on top. */
    value: T;
    /** True while at least one commit is in flight. */
    isPending: boolean;
    /** The error from the most recent failed commit. Cleared when a new update starts. */
    error: Error | null;
    /** Show `input` right away, run `commit`, and roll back if it rejects. Resolves to true on success. */
    update: (input: A, commit: OptimisticCommit<T>) => Promise<boolean>;
}

interface PendingUpdate<A> {
    id: number;
    input: A;
}

interface Confirmed<T> {
    value: T;
    /** Bumped whenever the caller passes a new `value`. */
    version: number;
}

function replace<T, A>(_current: T, input: A) {
    return input as unknown as T;
}

/**
 * Optimistic UI that works on React 18. Updates show instantly and roll back when the commit fails.
 * `value` is the source of truth: when it changes, pending updates are re-applied on top of it.
 * @example
 * const {value: likes, update} = useOptimisticState(post.likes, (n, delta: number) => n + delta);
 * <button onClick={() => update(1, () => api.like(post.id))}>{likes}</button>
 */
export function useOptimisticState<T, A = T>(
    value: T,
    updateFn: (current: T, input: A) => T = replace
): OptimisticState<T, A> {
    const [confirmed, setConfirmed] = useState<Confirmed<T>>({value, version: 0});
    const [previousValue, setPreviousValue] = useState(value);
    const [pending, setPending] = useState<PendingUpdate<A>[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const updateFnRef = useLatest(updateFn);
    const isMounted = useIsMounted();
    const nextId = useRef(0);

    // Adopt a new caller value during render (the documented "derive from props" pattern).
    let current = confirmed;
    if (!Object.is(previousValue, value)) {
        current = {value, version: confirmed.version + 1};
        setPreviousValue(value);
        setConfirmed(current);
    }

    const optimistic = pending.reduce((acc, item) => updateFn(acc, item.input), current.value);
    const latest = useLatest({optimistic, version: current.version});

    const update = useCallback(async (input: A, commit: OptimisticCommit<T>) => {
        const id = ++nextId.current;
        const startVersion = latest.current.version;
        const preview = updateFnRef.current(latest.current.optimistic, input);
        // Let a second update in the same tick build on this one before the next render.
        latest.current = {optimistic: preview, version: startVersion};

        setError(null);
        setPending((items) => [...items, {id, input}]);

        const settle = () => setPending((items) => items.filter((item) => item.id !== id));

        try {
            const result = await commit(preview);
            if (isMounted()) {
                setConfirmed((state) => {
                    if (result !== undefined) {
                        return {value: result as T, version: state.version};
                    }
                    // When the caller already passed a newer value, it includes this change.
                    return state.version === startVersion
                        ? {value: updateFnRef.current(state.value, input), version: state.version}
                        : state;
                });
                settle();
            }

            return true;
        } catch (reason) {
            if (isMounted()) {
                setError(reason instanceof Error ? reason : new Error(String(reason)));
                settle();
            }

            return false;
        }
    }, [updateFnRef, latest, isMounted]);

    return {value: optimistic, isPending: pending.length > 0, error, update};
}
