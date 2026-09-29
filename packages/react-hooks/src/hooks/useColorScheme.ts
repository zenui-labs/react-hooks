import {useCallback, useEffect, useState} from 'react';
import {isBrowser} from '../utils/env';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

export type ColorSchemePreference = 'light' | 'dark' | 'system';
export type ResolvedColorScheme = 'light' | 'dark';

export interface ColorSchemeOptions {
    /** localStorage key used to persist the preference. Defaults to `'color-scheme'`. */
    storageKey?: string;
}

export interface ColorSchemeResult {
    /** The stored preference. `'system'` follows the OS setting. */
    scheme: ColorSchemePreference;
    /** The scheme to render: the preference, or the OS setting when the preference is `'system'`. */
    resolved: ResolvedColorScheme;
    setScheme: (scheme: ColorSchemePreference) => void;
}

const DARK_QUERY = '(prefers-color-scheme: dark)';
// Keeps every hook instance in the same tab in sync. The `storage` event only fires in other tabs.
const SYNC_EVENT = 'zenui:color-scheme';

function isPreference(value: unknown): value is ColorSchemePreference {
    return value === 'light' || value === 'dark' || value === 'system';
}

function readStored(key: string): ColorSchemePreference {
    try {
        const value = window.localStorage.getItem(key);
        return isPreference(value) ? value : 'system';
    } catch {
        return 'system';
    }
}

/**
 * Store a light, dark or system color scheme preference and resolve it against the OS setting.
 * Persists to localStorage, syncs across tabs and reacts when the OS scheme changes.
 * Renders `'system'` / `'light'` on the server and first client render, so hydration is safe.
 *
 * @example
 * const {scheme, resolved, setScheme} = useColorScheme();
 * useEffect(() => { document.documentElement.dataset.theme = resolved; }, [resolved]);
 * <button onClick={() => setScheme('dark')}>Dark</button>
 */
export function useColorScheme(options: ColorSchemeOptions = {}): ColorSchemeResult {
    const {storageKey = 'color-scheme'} = options;
    const [scheme, setSchemeState] = useState<ColorSchemePreference>('system');
    const [systemDark, setSystemDark] = useState(false);

    useIsomorphicLayoutEffect(() => {
        if (!isBrowser) return;
        setSchemeState(readStored(storageKey));
    }, [storageKey]);

    useIsomorphicLayoutEffect(() => {
        if (!isBrowser || typeof window.matchMedia !== 'function') return;

        const mql = window.matchMedia(DARK_QUERY);
        const onChange = () => setSystemDark(mql.matches);
        onChange();

        if (typeof mql.addEventListener === 'function') {
            mql.addEventListener('change', onChange);
            return () => mql.removeEventListener('change', onChange);
        }
        mql.addListener(onChange);
        return () => mql.removeListener(onChange);
    }, []);

    useEffect(() => {
        if (!isBrowser) return;

        const onStorage = (event: StorageEvent) => {
            if (event.key === storageKey) setSchemeState(isPreference(event.newValue) ? event.newValue : 'system');
        };
        const onSync = (event: Event) => {
            const detail = (event as CustomEvent<{ key: string; value: ColorSchemePreference }>).detail;
            if (detail && detail.key === storageKey) setSchemeState(detail.value);
        };

        window.addEventListener('storage', onStorage);
        window.addEventListener(SYNC_EVENT, onSync);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener(SYNC_EVENT, onSync);
        };
    }, [storageKey]);

    const setScheme = useCallback((next: ColorSchemePreference) => {
        setSchemeState(next);
        if (!isBrowser) return;
        try {
            window.localStorage.setItem(storageKey, next);
        } catch {
            // Storage can be full or blocked (private mode). The in-memory value still applies.
        }
        window.dispatchEvent(new CustomEvent(SYNC_EVENT, {detail: {key: storageKey, value: next}}));
    }, [storageKey]);

    const resolved: ResolvedColorScheme = scheme === 'system' ? (systemDark ? 'dark' : 'light') : scheme;

    return {scheme, resolved, setScheme};
}
