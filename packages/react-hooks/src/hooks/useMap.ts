import {useCallback, useRef, useState} from 'react';

export type MapInit<K, V> = Iterable<readonly [K, V]> | ReadonlyMap<K, V>;

export interface MapState<K, V> {
    /** The current map. Treat it as read only; a new Map is created on every change. */
    map: ReadonlyMap<K, V>;
    size: number;
    /** Add or replace one entry. */
    set: (key: K, value: V) => void;
    /** Add or replace several entries in one update. */
    setAll: (entries: MapInit<K, V>) => void;
    /** Remove one entry. Named `remove` because `delete` cannot be destructured. */
    remove: (key: K) => void;
    /** Remove every entry. */
    clear: () => void;
    /** Restore the entries passed on the first render. */
    reset: () => void;
}

/**
 * A reactive Map. Updates are immutable, so the map can be used in dependency arrays.
 * @example
 * const {map, set, remove} = useMap<string, number>([['apples', 3]]);
 * set('pears', 2);
 * remove('apples');
 */
export function useMap<K, V>(initial?: MapInit<K, V>): MapState<K, V> {
    const initialRef = useRef(initial);
    const [map, setMap] = useState<ReadonlyMap<K, V>>(() => new Map(initial ?? []));

    const set = useCallback((key: K, value: V) => {
        setMap((current) => {
            if (current.has(key) && Object.is(current.get(key), value)) {
                return current;
            }

            const next = new Map(current);
            next.set(key, value);

            return next;
        });
    }, []);

    const setAll = useCallback((entries: MapInit<K, V>) => {
        setMap((current) => {
            const next = new Map(current);
            for (const [key, value] of entries) {
                next.set(key, value);
            }

            return next;
        });
    }, []);

    const remove = useCallback((key: K) => {
        setMap((current) => {
            if (!current.has(key)) {
                return current;
            }

            const next = new Map(current);
            next.delete(key);

            return next;
        });
    }, []);

    const clear = useCallback(() => {
        setMap((current) => current.size === 0 ? current : new Map());
    }, []);

    const reset = useCallback(() => {
        setMap(new Map(initialRef.current ?? []));
    }, []);

    return {map, size: map.size, set, setAll, remove, clear, reset};
}
