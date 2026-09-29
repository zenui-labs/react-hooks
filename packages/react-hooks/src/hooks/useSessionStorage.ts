import {useCallback, useEffect, useRef, useState} from 'react';
import type {SessionStorageResult} from '../types';
import {isBrowser} from '../utils/env';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';
import {useLatest} from './useLatest';

/** Fired on `window` when a hook instance writes, so other instances in the same tab can sync. */
const SESSION_STORAGE_EVENT = 'zenui:session-storage';

interface SessionStorageEventDetail {
    key: string;
    source: object;
}

function readSessionStorage<T>(key: string, fallback: T): T {
    if (!isBrowser) return fallback;
    try {
        const item = window.sessionStorage.getItem(key);
        return item === null ? fallback : (JSON.parse(item) as T);
    } catch (error) {
        console.warn(`Error reading sessionStorage key "${key}":`, error);
        return fallback;
    }
}

/**
 * Keep state in `sessionStorage` as JSON. The value lives until the tab is closed.
 * The first render returns `initialValue` (same as the server), then the stored value
 * is read in a layout effect before the browser paints.
 * @example
 * const {value: step, setValue: setStep, remove} = useSessionStorage('checkout-step', 1);
 * setStep((prev) => prev + 1);
 */
export function useSessionStorage<T>(key: string, initialValue: T): SessionStorageResult<T> {
    const [value, setState] = useState<T>(initialValue);
    const valueRef = useRef<T>(initialValue);
    const initialRef = useLatest(initialValue);
    const keyRef = useLatest(key);
    const sourceRef = useRef<object>({});

    const apply = useCallback((next: T) => {
        valueRef.current = next;
        setState(next);
    }, []);

    useIsomorphicLayoutEffect(() => {
        apply(readSessionStorage(key, initialRef.current));
    }, [key, apply, initialRef]);

    useEffect(() => {
        const onChange = (event: Event) => {
            const detail = (event as CustomEvent<SessionStorageEventDetail>).detail;
            if (!detail || detail.key !== key || detail.source === sourceRef.current) return;
            apply(readSessionStorage(key, initialRef.current));
        };

        window.addEventListener(SESSION_STORAGE_EVENT, onChange);
        return () => window.removeEventListener(SESSION_STORAGE_EVENT, onChange);
    }, [key, apply, initialRef]);

    const notify = useCallback(() => {
        window.dispatchEvent(new CustomEvent<SessionStorageEventDetail>(SESSION_STORAGE_EVENT, {
            detail: {key: keyRef.current, source: sourceRef.current},
        }));
    }, [keyRef]);

    const setValue = useCallback((next: T | ((prev: T) => T)) => {
        const resolved = next instanceof Function ? next(valueRef.current) : next;
        apply(resolved);
        if (!isBrowser) return;
        try {
            window.sessionStorage.setItem(keyRef.current, JSON.stringify(resolved));
            notify();
        } catch (error) {
            console.warn(`Error setting sessionStorage key "${keyRef.current}":`, error);
        }
    }, [apply, keyRef, notify]);

    const remove = useCallback(() => {
        apply(initialRef.current);
        if (!isBrowser) return;
        try {
            window.sessionStorage.removeItem(keyRef.current);
            notify();
        } catch (error) {
            console.warn(`Error removing sessionStorage key "${keyRef.current}":`, error);
        }
    }, [apply, initialRef, keyRef, notify]);

    return {value, setValue, remove};
}
