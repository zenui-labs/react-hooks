import {useCallback, useRef, useState} from 'react';

export interface SetState<T> {
    /** The current set. Treat it as read only; a new Set is created on every change. */
    set: ReadonlySet<T>;
    size: number;
    /** True when `item` is in the set rendered this time. */
    has: (item: T) => boolean;
    add: (item: T) => void;
    /** Remove one item. Named `remove` because `delete` cannot be destructured. */
    remove: (item: T) => void;
    /** Add the item when missing, remove it when present. Pass `force` to pick the direction. */
    toggle: (item: T, force?: boolean) => void;
    clear: () => void;
    /** Restore the items passed on the first render. */
    reset: () => void;
}

/**
 * A reactive Set with immutable updates. Good for selections, tags and filters.
 * @example
 * const {set, toggle, has} = useSet<string>(['react']);
 * <button onClick={() => toggle('vue')}>{has('vue') ? 'Remove' : 'Add'} vue</button>
 */
export function useSet<T>(initial?: Iterable<T>): SetState<T> {
    const initialRef = useRef(initial);
    const [set, setSet] = useState<ReadonlySet<T>>(() => new Set(initial ?? []));

    const add = useCallback((item: T) => {
        setSet((current) => {
            if (current.has(item)) {
                return current;
            }

            const next = new Set(current);
            next.add(item);

            return next;
        });
    }, []);

    const remove = useCallback((item: T) => {
        setSet((current) => {
            if (!current.has(item)) {
                return current;
            }

            const next = new Set(current);
            next.delete(item);

            return next;
        });
    }, []);

    const toggle = useCallback((item: T, force?: boolean) => {
        setSet((current) => {
            const present = current.has(item);
            const shouldHave = force ?? !present;

            if (shouldHave === present) {
                return current;
            }

            const next = new Set(current);
            if (shouldHave) {
                next.add(item);
            } else {
                next.delete(item);
            }

            return next;
        });
    }, []);

    const clear = useCallback(() => {
        setSet((current) => current.size === 0 ? current : new Set());
    }, []);

    const reset = useCallback(() => {
        setSet(new Set(initialRef.current ?? []));
    }, []);

    const has = useCallback((item: T) => set.has(item), [set]);

    return {set, size: set.size, has, add, remove, toggle, clear, reset};
}
