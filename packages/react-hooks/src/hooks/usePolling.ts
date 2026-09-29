import {useCallback, useEffect, useRef, useState} from 'react';
import {isBrowser} from '../utils/env';
import {useLatest} from './useLatest';

export interface PollingBackoffOptions {
    /** Multiplier applied to the interval for each consecutive error. Defaults to 2. */
    factor?: number;
    /** Longest delay between polls in milliseconds. Defaults to 16 times the interval. */
    max?: number;
}

export interface PollingOptions<T> {
    /** Milliseconds between the end of one call and the start of the next. */
    interval: number;
    /** Poll while true. Defaults to true. */
    enabled?: boolean;
    /** Skip polls while the tab is hidden and poll once when it becomes visible. Defaults to true. */
    pauseWhenHidden?: boolean;
    /** Back off exponentially after errors. Omit to retry at the normal interval. */
    backoff?: PollingBackoffOptions;
    /** Poll as soon as polling starts instead of waiting one interval. Defaults to true. */
    immediate?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: unknown) => void;
}

export interface PollingResult<T> {
    data: T | undefined;
    error: unknown;
    /** True while the poller is started (even if paused because the tab is hidden). */
    isPolling: boolean;
    /** True while the tab is hidden and polling is on hold. */
    isPaused: boolean;
    /** True while a call is in flight. */
    isFetching: boolean;
    /** Timestamp of the last successful call, or `null`. */
    lastUpdated: number | null;
    /** Consecutive failed calls. Resets on success. */
    errorCount: number;
    /** Delay before the next scheduled call, including backoff. */
    nextDelay: number;
    start: () => void;
    /** Stop polling and abort the call in flight. */
    stop: () => void;
    /** Poll right away. Returns the in-flight call instead of starting a second one. */
    pollNow: () => Promise<T | undefined>;
}

/**
 * Call an async function on an interval. Calls never overlap, polling pauses while the tab is hidden,
 * and errors can back off exponentially.
 * @example
 * const {data, error} = usePolling((signal) => fetch('/api/status', {signal}).then((r) => r.json()), {
 *     interval: 5000,
 *     backoff: {factor: 2, max: 60000},
 * });
 */
export function usePolling<T>(fn: (signal: AbortSignal) => Promise<T>, options: PollingOptions<T>): PollingResult<T> {
    const {interval, enabled = true, pauseWhenHidden = true} = options;
    const [active, setActive] = useState(enabled);
    const [hidden, setHidden] = useState(false);
    const [data, setData] = useState<T | undefined>(undefined);
    const [error, setError] = useState<unknown>(undefined);
    const [isFetching, setIsFetching] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<number | null>(null);
    const [errorCount, setErrorCount] = useState(0);
    const [nextDelay, setNextDelay] = useState(interval);

    const fnRef = useLatest(fn);
    const optionsRef = useLatest(options);
    const activeRef = useRef(active);
    const errorCountRef = useRef(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inFlightRef = useRef<Promise<T | undefined> | null>(null);
    const controllerRef = useRef<AbortController | null>(null);
    const mountedRef = useRef(false);

    const clearTimer = useCallback(() => {
        if (timerRef.current !== null) clearTimeout(timerRef.current);
        timerRef.current = null;
    }, []);

    const canSchedule = useCallback(() => {
        const {pauseWhenHidden: pause = true} = optionsRef.current;
        const isHidden = isBrowser && document.visibilityState === 'hidden';
        return mountedRef.current && activeRef.current && !(pause && isHidden);
    }, [optionsRef]);

    const delayFor = useCallback((failures: number) => {
        const {interval: base, backoff} = optionsRef.current;
        if (!backoff || failures === 0) return base;
        const factor = backoff.factor ?? 2;
        const max = backoff.max ?? base * 16;
        return Math.min(base * factor ** failures, max);
    }, [optionsRef]);

    const tickRef = useRef<() => Promise<T | undefined>>(() => Promise.resolve(undefined));

    const schedule = useCallback((delay: number) => {
        clearTimer();
        setNextDelay(delay);
        timerRef.current = setTimeout(() => {
            timerRef.current = null;
            void tickRef.current();
        }, delay);
    }, [clearTimer]);

    tickRef.current = () => {
        if (inFlightRef.current) return inFlightRef.current;
        clearTimer();

        const controller = new AbortController();
        controllerRef.current = controller;
        setIsFetching(true);

        const call = Promise.resolve()
            .then(() => fnRef.current(controller.signal))
            .then(
                (result) => {
                    if (controller.signal.aborted || !mountedRef.current) return undefined;
                    errorCountRef.current = 0;
                    setErrorCount(0);
                    setData(() => result);
                    setError(undefined);
                    setLastUpdated(Date.now());
                    optionsRef.current.onSuccess?.(result);
                    return result;
                },
                (reason: unknown) => {
                    if (controller.signal.aborted || !mountedRef.current) return undefined;
                    errorCountRef.current += 1;
                    setErrorCount(errorCountRef.current);
                    setError(reason);
                    optionsRef.current.onError?.(reason);
                    return undefined;
                }
            )
            .finally(() => {
                if (controllerRef.current === controller) controllerRef.current = null;
                // Stopped, unmounted or superseded: whoever cleared the slot owns the state now.
                if (inFlightRef.current !== call) return;
                inFlightRef.current = null;
                setIsFetching(false);
                if (!controller.signal.aborted && canSchedule()) schedule(delayFor(errorCountRef.current));
            });

        inFlightRef.current = call;
        return call;
    };

    useEffect(() => {
        setActive(enabled);
    }, [enabled]);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            clearTimer();
            controllerRef.current?.abort();
            inFlightRef.current = null;
        };
    }, [clearTimer]);

    // Start or stop the loop when `active` flips.
    useEffect(() => {
        activeRef.current = active;
        if (!active) {
            clearTimer();
            controllerRef.current?.abort();
            inFlightRef.current = null;
            setIsFetching(false);
            return;
        }
        if (!canSchedule()) return;
        if (optionsRef.current.immediate === false) schedule(delayFor(errorCountRef.current));
        else void tickRef.current();
    }, [active, canSchedule, clearTimer, delayFor, optionsRef, schedule]);

    useEffect(() => {
        if (!isBrowser) return;
        const onVisibility = () => {
            const isHidden = document.visibilityState === 'hidden';
            setHidden(isHidden);
            if (!pauseWhenHidden || !activeRef.current) return;
            if (isHidden) clearTimer();
            else if (!inFlightRef.current) void tickRef.current();
        };
        setHidden(document.visibilityState === 'hidden');
        document.addEventListener('visibilitychange', onVisibility);
        return () => document.removeEventListener('visibilitychange', onVisibility);
    }, [pauseWhenHidden, clearTimer]);

    const start = useCallback(() => setActive(true), []);
    const stop = useCallback(() => setActive(false), []);
    const pollNow = useCallback(() => tickRef.current(), []);

    return {
        data,
        error,
        isPolling: active,
        isPaused: active && pauseWhenHidden && hidden,
        isFetching,
        lastUpdated,
        errorCount,
        nextDelay,
        start,
        stop,
        pollNow,
    };
}
