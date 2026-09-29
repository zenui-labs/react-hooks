import {useCallback, useEffect, useRef, useState} from 'react';
import {hasNavigator, isBrowser} from '../utils/env';
import {useIsMounted} from './useIsMounted';

export interface WakeLockResult {
    /** False when the Screen Wake Lock API is missing. */
    isSupported: boolean;
    /** True while a screen wake lock is held. */
    isActive: boolean;
    /** The last request error, for example when the page is hidden or battery saver is on. */
    error: Error | null;
    /** Ask the browser to keep the screen on. Resolves once the lock is held or the request failed. */
    request: () => Promise<void>;
    /** Release the lock and stop re-acquiring it. */
    release: () => Promise<void>;
}

function supportsWakeLock() {
    return hasNavigator && 'wakeLock' in navigator && !!navigator.wakeLock;
}

/**
 * Keep the screen from dimming with the Screen Wake Lock API.
 * The browser drops the lock when the tab is hidden; the hook requests it again when the tab
 * becomes visible if you had not released it.
 *
 * @example
 * const {isSupported, isActive, request, release} = useWakeLock();
 * <button onClick={isActive ? release : request}>{isActive ? 'Allow sleep' : 'Keep screen on'}</button>
 */
export function useWakeLock(): WakeLockResult {
    const [isSupported, setIsSupported] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const sentinelRef = useRef<WakeLockSentinel | null>(null);
    // The user's intent: keep the lock whenever the page is visible.
    const wantedRef = useRef(false);
    const pendingRef = useRef(false);
    const isMounted = useIsMounted();

    const acquire = useCallback(async () => {
        if (!supportsWakeLock() || sentinelRef.current || pendingRef.current) return;
        pendingRef.current = true;
        try {
            const sentinel = await navigator.wakeLock.request('screen');
            if (!isMounted() || !wantedRef.current) {
                // Released or unmounted while the request was in flight.
                await sentinel.release();
                return;
            }
            sentinelRef.current = sentinel;
            setIsActive(true);
            setError(null);
            sentinel.addEventListener('release', () => {
                if (sentinelRef.current === sentinel) sentinelRef.current = null;
                if (isMounted()) setIsActive(false);
            });
        } catch (err) {
            if (isMounted()) setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            pendingRef.current = false;
        }
    }, [isMounted]);

    const request = useCallback(async () => {
        wantedRef.current = true;
        await acquire();
    }, [acquire]);

    const release = useCallback(async () => {
        wantedRef.current = false;
        const sentinel = sentinelRef.current;
        sentinelRef.current = null;
        setIsActive(false);
        if (sentinel && !sentinel.released) await sentinel.release().catch(() => undefined);
    }, []);

    useEffect(() => {
        setIsSupported(supportsWakeLock());
        if (!isBrowser) return;

        const onVisibility = () => {
            if (document.visibilityState === 'visible' && wantedRef.current) void acquire();
        };
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            document.removeEventListener('visibilitychange', onVisibility);
            const sentinel = sentinelRef.current;
            sentinelRef.current = null;
            if (sentinel && !sentinel.released) sentinel.release().catch(() => undefined);
        };
    }, [acquire]);

    return {isSupported, isActive, error, request, release};
}
