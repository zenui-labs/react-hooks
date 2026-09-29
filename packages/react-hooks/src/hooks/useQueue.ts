import {useCallback, useRef, useState} from 'react';

export interface QueueState<T> {
    /** Items in order, oldest first. */
    queue: readonly T[];
    size: number;
    /** The next item `dequeue` returns. */
    first: T | undefined;
    /** The most recently added item. */
    last: T | undefined;
    /** Add one or more items to the back. */
    enqueue: (...items: T[]) => void;
    /** Remove and return the front item, or `undefined` when empty. */
    dequeue: () => T | undefined;
    /** Return the front item without removing it. */
    peek: () => T | undefined;
    clear: () => void;
}

/**
 * A first-in, first-out queue. `dequeue` returns the removed item right away,
 * so it can be called several times in one event handler.
 * @example
 * const {enqueue, dequeue, size} = useQueue<string>();
 * enqueue('job-1', 'job-2');
 * const next = dequeue(); // 'job-1'
 */
export function useQueue<T>(initial?: Iterable<T>): QueueState<T> {
    const [queue, setQueue] = useState<readonly T[]>(() => Array.from(initial ?? []));
    // Source of truth for synchronous reads. Every mutation replaces it, then syncs state.
    const queueRef = useRef<readonly T[]>(queue);

    const commit = useCallback((next: readonly T[]) => {
        queueRef.current = next;
        setQueue(next);
    }, []);

    const enqueue = useCallback((...items: T[]) => {
        if (items.length > 0) {
            commit([...queueRef.current, ...items]);
        }
    }, [commit]);

    const dequeue = useCallback(() => {
        const current = queueRef.current;
        if (current.length === 0) {
            return undefined;
        }

        commit(current.slice(1));

        return current[0];
    }, [commit]);

    const peek = useCallback(() => queueRef.current[0], []);

    const clear = useCallback(() => {
        if (queueRef.current.length > 0) {
            commit([]);
        }
    }, [commit]);

    return {
        queue,
        size: queue.length,
        first: queue[0],
        last: queue[queue.length - 1],
        enqueue,
        dequeue,
        peek,
        clear,
    };
}
