import {useCallback, useEffect, useReducer} from 'react';
import {isBrowser} from '../utils/env';
import {useLatest} from './useLatest';

export interface CachedFetchOptions {
    /** Milliseconds cached data counts as fresh. Fresh data is served without a request. Defaults to 0. */
    ttl?: number;
    /** Revalidate stale data when the window regains focus. Defaults to true. */
    revalidateOnFocus?: boolean;
    /** Revalidate when the browser comes back online. Defaults to true. */
    revalidateOnReconnect?: boolean;
    /** Requests for the same key within this many milliseconds share one request. Defaults to 2000. */
    dedupeInterval?: number;
}

export interface CachedFetchMutateOptions {
    /** Fetch again after writing the value. Defaults to true. */
    revalidate?: boolean;
}

export type CachedFetchMutation<T> = T | ((current: T | undefined) => T);

export interface CachedFetch<T> {
    data: T | undefined;
    error: Error | null;
    /** True while nothing is cached for the key and the first request is pending. */
    isLoading: boolean;
    /** True while any request for the key runs, including background revalidation. */
    isValidating: boolean;
    /** `Date.now()` when the cached value was last written, or null. */
    updatedAt: number | null;
    /** Write to the shared cache (every consumer of the key updates), then optionally revalidate. */
    mutate: (data: CachedFetchMutation<T>, options?: CachedFetchMutateOptions) => Promise<T | undefined>;
    /** Fetch now, sharing any request already in flight. */
    revalidate: () => Promise<T | undefined>;
}

interface CacheEntry {
    data: unknown;
    hasData: boolean;
    error: Error | null;
    updatedAt: number | null;
    promise: Promise<unknown> | null;
    startedAt: number;
    mutatedAt: number;
}

type Listener = () => void;

const cache = new Map<string, CacheEntry>();
const listeners = new Map<string, Set<Listener>>();

function getEntry(key: string): CacheEntry {
    let entry = cache.get(key);
    if (!entry) {
        entry = {data: undefined, hasData: false, error: null, updatedAt: null, promise: null, startedAt: 0, mutatedAt: 0};
        cache.set(key, entry);
    }

    return entry;
}

function notify(key: string) {
    listeners.get(key)?.forEach((listener) => listener());
}

function subscribe(key: string, listener: Listener) {
    let set = listeners.get(key);
    if (!set) {
        set = new Set();
        listeners.set(key, set);
    }
    set.add(listener);

    return () => {
        set!.delete(listener);
        if (set!.size === 0) {
            listeners.delete(key);
        }
    };
}

function toError(value: unknown) {
    return value instanceof Error ? value : new Error(String(value));
}

function fetchKey<T>(key: string, fetcher: (key: string) => Promise<T>, dedupeInterval: number, force: boolean) {
    const entry = getEntry(key);

    if (entry.promise) {
        return entry.promise as Promise<T | undefined>;
    }

    if (!force && entry.hasData && Date.now() - entry.startedAt < dedupeInterval) {
        return Promise.resolve(entry.data as T);
    }

    const startedAt = Date.now();
    const promise: Promise<T | undefined> = Promise.resolve()
        .then(() => fetcher(key))
        .then(
            (data) => {
                const current = cache.get(key);
                // Ignore results superseded by a mutate() or a cache clear during the request.
                if (current !== entry || entry.promise !== promise || entry.mutatedAt > startedAt) {
                    return current?.data as T | undefined;
                }
                entry.data = data;
                entry.hasData = true;
                entry.error = null;
                entry.updatedAt = Date.now();

                return data;
            },
            (error: unknown) => {
                if (cache.get(key) === entry && entry.promise === promise && entry.mutatedAt <= startedAt) {
                    entry.error = toError(error);
                }

                return entry.data as T | undefined;
            }
        )
        .finally(() => {
            if (entry.promise === promise) {
                entry.promise = null;
            }
            notify(key);
        });

    entry.promise = promise;
    entry.startedAt = startedAt;
    notify(key);

    return promise;
}

/**
 * Remove cached data for one key, or for every key. Mounted consumers of a cleared key fetch it again.
 */
export function clearCachedFetch(key?: string) {
    const keys = key === undefined ? Array.from(cache.keys()) : [key];
    keys.forEach((k) => {
        cache.delete(k);
        notify(k);
    });
}

/**
 * Stale-while-revalidate data fetching with a cache shared by every component.
 * Cached data renders immediately while a background request refreshes it. Pass `null` as key to pause.
 * @example
 * const {data, isLoading, mutate} = useCachedFetch(`/api/users/${id}`, (url) =>
 *     fetch(url).then((r) => r.json()), {ttl: 10_000});
 */
export function useCachedFetch<T>(
    key: string | null,
    fetcher: (key: string) => Promise<T>,
    options: CachedFetchOptions = {}
): CachedFetch<T> {
    const {ttl = 0, revalidateOnFocus = true, revalidateOnReconnect = true, dedupeInterval = 2000} = options;
    const [, rerender] = useReducer((n: number) => n + 1, 0);
    const fetcherRef = useLatest(fetcher);
    const settingsRef = useLatest({ttl, dedupeInterval});

    const entry = key === null ? undefined : cache.get(key);

    const revalidate = useCallback((force = true): Promise<T | undefined> => {
        if (key === null) {
            return Promise.resolve(undefined);
        }

        return fetchKey<T>(key, (k) => fetcherRef.current(k), settingsRef.current.dedupeInterval, force);
    }, [key, fetcherRef, settingsRef]);

    const revalidateIfStale = useCallback(() => {
        if (key === null) {
            return;
        }
        const current = cache.get(key);
        const fresh = current?.hasData && current.updatedAt !== null
            && Date.now() - current.updatedAt < settingsRef.current.ttl;
        if (!fresh) {
            void revalidate(false);
        }
    }, [key, revalidate, settingsRef]);

    // Subscribe and load on mount and whenever the key changes.
    useEffect(() => {
        if (key === null) {
            return;
        }

        const unsubscribe = subscribe(key, () => {
            rerender();
            // The entry was cleared with clearCachedFetch while mounted: load it again.
            if (!cache.has(key)) {
                revalidateIfStale();
            }
        });
        rerender();
        revalidateIfStale();

        return unsubscribe;
    }, [key, revalidateIfStale]);

    useEffect(() => {
        if (!isBrowser || key === null || !revalidateOnFocus) {
            return;
        }

        const onFocus = () => {
            if (document.visibilityState !== 'hidden') {
                revalidateIfStale();
            }
        };

        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onFocus);

        return () => {
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onFocus);
        };
    }, [key, revalidateOnFocus, revalidateIfStale]);

    useEffect(() => {
        if (!isBrowser || key === null || !revalidateOnReconnect) {
            return;
        }

        const onOnline = () => void revalidate(false);
        window.addEventListener('online', onOnline);

        return () => window.removeEventListener('online', onOnline);
    }, [key, revalidateOnReconnect, revalidate]);

    const mutate = useCallback(async (
        data: CachedFetchMutation<T>,
        mutateOptions: CachedFetchMutateOptions = {}
    ): Promise<T | undefined> => {
        if (key === null) {
            return undefined;
        }

        const target = getEntry(key);
        const next = typeof data === 'function'
            ? (data as (current: T | undefined) => T)(target.data as T | undefined)
            : data;
        const now = Date.now();

        target.data = next;
        target.hasData = true;
        target.error = null;
        target.updatedAt = now;
        target.mutatedAt = now;
        // A request started before this write can no longer win, so let a new one start.
        target.promise = null;
        notify(key);

        if (mutateOptions.revalidate ?? true) {
            return revalidate(true);
        }

        return next;
    }, [key, revalidate]);

    const manualRevalidate = useCallback(() => revalidate(true), [revalidate]);

    const isValidating = Boolean(entry?.promise);
    const hasData = Boolean(entry?.hasData);

    return {
        data: hasData ? entry!.data as T : undefined,
        error: entry?.error ?? null,
        isLoading: key !== null && !hasData && (isValidating || entry === undefined),
        isValidating,
        updatedAt: entry?.updatedAt ?? null,
        mutate,
        revalidate: manualRevalidate,
    };
}
