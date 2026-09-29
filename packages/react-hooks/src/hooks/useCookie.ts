import {useCallback, useEffect, useRef, useState} from 'react';
import {CookieOptions} from '../types';
import {isBrowser} from '../utils/env';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';
import {useLatest} from './useLatest';

// Fired on window after this hook writes a cookie, so every instance reading the same name re-syncs.
const COOKIE_EVENT = 'zenui:cookiechange';

interface CookieChangeDetail {
    name: string;
    value: string;
}

function safeDecode(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

function readCookie(name: string): string | null {
    if (!isBrowser) return null;

    const pairs = document.cookie ? document.cookie.split(';') : [];
    for (const pair of pairs) {
        const index = pair.indexOf('=');
        const rawName = (index === -1 ? pair : pair.slice(0, index)).trim();
        if (safeDecode(rawName) === name) {
            return index === -1 ? '' : safeDecode(pair.slice(index + 1).trim());
        }
    }

    return null;
}

function serialize(name: string, value: string, options: CookieOptions): string {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.path) cookie += `; path=${options.path}`;
    if (options.domain) cookie += `; domain=${options.domain}`;
    if (options.expires) cookie += `; expires=${options.expires.toUTCString()}`;
    if (options.maxAge !== undefined) cookie += `; max-age=${options.maxAge}`;
    if (options.secure) cookie += '; secure';
    if (options.sameSite) cookie += `; samesite=${options.sameSite}`;

    return cookie;
}

/**
 * Read and write a single browser cookie as React state.
 * Starts with `initialValue` on the server and syncs to the real cookie before the first paint.
 * @example
 * const {value, setValue, remove} = useCookie('theme', 'light');
 * setValue('dark', {path: '/', maxAge: 60 * 60 * 24 * 365});
 */
export function useCookie(name: string, initialValue: string = '') {
    const [value, setValueState] = useState<string>(initialValue);
    const initialRef = useLatest(initialValue);
    // Remember where the cookie was written so remove() targets the same path and domain.
    const scopeRef = useRef<Pick<CookieOptions, 'path' | 'domain'>>({});

    useIsomorphicLayoutEffect(() => {
        const sync = () => {
            const current = readCookie(name);
            setValueState(current === null ? initialRef.current : current);
        };

        sync();

        const onChange = (event: Event) => {
            const detail = (event as CustomEvent<CookieChangeDetail>).detail;
            if (detail && detail.name === name) setValueState(detail.value);
        };

        window.addEventListener(COOKIE_EVENT, onChange);
        return () => window.removeEventListener(COOKIE_EVENT, onChange);
    }, [name, initialRef]);

    const updateCookie = useCallback((newValue: string, options: CookieOptions = {}) => {
        if (!isBrowser) return;

        document.cookie = serialize(name, newValue, options);
        scopeRef.current = {path: options.path, domain: options.domain};
        setValueState(newValue);
        window.dispatchEvent(new CustomEvent<CookieChangeDetail>(COOKIE_EVENT, {detail: {name, value: newValue}}));
    }, [name]);

    const removeCookie = useCallback((options?: Pick<CookieOptions, 'path' | 'domain'>) => {
        if (!isBrowser) return;

        const scope = options ?? scopeRef.current;
        document.cookie = serialize(name, '', {
            path: scope.path,
            domain: scope.domain,
            expires: new Date(0),
            maxAge: 0,
        });
        setValueState('');
        window.dispatchEvent(new CustomEvent<CookieChangeDetail>(COOKIE_EVENT, {detail: {name, value: ''}}));
    }, [name]);

    useEffect(() => {
        scopeRef.current = {};
    }, [name]);

    return {value, setValue: updateCookie, remove: removeCookie};
}
