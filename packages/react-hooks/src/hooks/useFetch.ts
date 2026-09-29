import {useCallback, useEffect, useRef, useState} from 'react';
import type {FetchResult} from '../types';
import {useLatest} from './useLatest';

/** JSON form of the options, or null when they cannot be serialized. */
function optionsKey(options: RequestInit | undefined): string | null {
    if (!options) return '';
    try {
        return JSON.stringify(options);
    } catch {
        return null;
    }
}

/**
 * Fetch JSON from `url` and track `data`, `loading` and `error`.
 * Refetches when `url` or the JSON form of `options` changes, aborts stale requests,
 * and skips the request while `url` is empty.
 * @example
 * const {data, loading, error, refetch} = useFetch<User[]>('/api/users');
 * if (loading) return <p>Loading</p>;
 */
export function useFetch<T>(url: string | null | undefined, options?: RequestInit): FetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(Boolean(url));
    const [error, setError] = useState<string | null>(null);

    const urlRef = useLatest(url);
    const optionsRef = useLatest(options);
    const controllerRef = useRef<AbortController | null>(null);

    const run = useCallback(() => {
        controllerRef.current?.abort();
        const target = urlRef.current;
        if (!target) {
            controllerRef.current = null;
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        controllerRef.current = controller;
        const userSignal = optionsRef.current?.signal;
        if (userSignal) {
            if (userSignal.aborted) controller.abort();
            else userSignal.addEventListener('abort', () => controller.abort(), {once: true});
        }

        setLoading(true);
        setError(null);

        fetch(target, {...optionsRef.current, signal: controller.signal})
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }
                return response.json() as Promise<T>;
            })
            .then((result) => {
                if (controller.signal.aborted) return;
                setData(result);
                setLoading(false);
            })
            .catch((err: unknown) => {
                if (controller.signal.aborted) return;
                setError(err instanceof Error ? err.message : 'An error occurred');
                setLoading(false);
            });
    }, [urlRef, optionsRef]);

    // Compare options by their JSON form so an inline object does not refetch on every render.
    // Unserializable options fall back to identity.
    const key = optionsKey(options);
    const optionsDep = key === null ? options : key;

    useEffect(() => {
        run();
        return () => controllerRef.current?.abort();
    }, [url, optionsDep, run]);

    return {data, loading, error, refetch: run};
}
