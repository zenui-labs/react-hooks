import {useCallback, useEffect, useRef, useState} from 'react';
import type {LocalStorageResult} from '../types';
import {isBrowser} from '../utils/env';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';
import {useLatest} from './useLatest';

/** Fired on `window` when a hook instance writes, so other instances in the same tab can sync. */
const LOCAL_STORAGE_EVENT = 'zenui:local-storage';

interface LocalStorageEventDetail {
    key: string;
    source: object;
}

function readLocalStorage<T>(key: string, fallback: T): T {
    if (!isBrowser) return fallback;
    try {
        const item = window.localStorage.getItem(key);
        return item === null ? fallback : (JSON.parse(item) as T);
    } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        return fallback;
    }
}

/**
 * Keep state in `localStorage` as JSON, synced across hook instances and browser tabs.
 * The first render always returns `initialValue` (same as the server), then the stored
 * value is read in a layout effect before the browser paints.
 * @example
 * const {storedValue: theme, setValue: setTheme, remove} = useLocalStorage('theme', 'light');
 * setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
 */
export function useLocalStorage<T>(key: string, initialValue: T): LocalStorageResult<T> {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const valueRef = useRef<T>(initialValue);
    const initialRef = useLatest(initialValue);
    const keyRef = useLatest(key);
    // Identity token so an instance ignores the sync event it dispatched itself.
    const sourceRef = useRef<object>({});

    const apply = useCallback((next: T) => {
        valueRef.current = next;
        setStoredValue(next);
    }, []);

    // Read the stored value after mount and whenever the key changes.
    useIsomorphicLayoutEffect(() => {
        apply(readLocalStorage(key, initialRef.current));
    }, [key, apply, initialRef]);

    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            if (event.storageArea !== window.localStorage || (event.key !== null && event.key !== key)) return;
            apply(readLocalStorage(key, initialRef.current));
        };
        const onLocalChange = (event: Event) => {
            const detail = (event as CustomEvent<LocalStorageEventDetail>).detail;
            if (!detail || detail.key !== key || detail.source === sourceRef.current) return;
            apply(readLocalStorage(key, initialRef.current));
        };

        window.addEventListener('storage', onStorage);
        window.addEventListener(LOCAL_STORAGE_EVENT, onLocalChange);

        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener(LOCAL_STORAGE_EVENT, onLocalChange);
        };
    }, [key, apply, initialRef]);

    const notify = useCallback(() => {
        window.dispatchEvent(new CustomEvent<LocalStorageEventDetail>(LOCAL_STORAGE_EVENT, {
            detail: {key: keyRef.current, source: sourceRef.current},
        }));
    }, [keyRef]);

    const setValue = useCallback((value: T | ((prev: T) => T)) => {
        const next = value instanceof Function ? value(valueRef.current) : value;
        apply(next);
        if (!isBrowser) return;
        try {
            window.localStorage.setItem(keyRef.current, JSON.stringify(next));
            notify();
        } catch (error) {
            console.warn(`Error setting localStorage key "${keyRef.current}":`, error);
        }
    }, [apply, keyRef, notify]);

    const remove = useCallback(() => {
        apply(initialRef.current);
        if (!isBrowser) return;
        try {
            window.localStorage.removeItem(keyRef.current);
            notify();
        } catch (error) {
            console.warn(`Error removing localStorage key "${keyRef.current}":`, error);
        }
    }, [apply, initialRef, keyRef, notify]);

    return {storedValue, setValue, remove};
}
