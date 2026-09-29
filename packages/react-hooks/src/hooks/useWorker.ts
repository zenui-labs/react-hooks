import {useCallback, useEffect, useRef, useState} from 'react';
import {isBrowser} from '../utils/env';
import {useLatest} from './useLatest';

export type WorkerStatus = 'idle' | 'running' | 'success' | 'error' | 'timeout';

export interface WorkerOptions {
    /** Terminate the worker and reject when a run takes longer than this many milliseconds. */
    timeout?: number;
}

export interface WorkerResult<Args extends unknown[], R> {
    /** Run the function in the worker. Resolves with its return value, rejects on error, timeout or terminate. */
    run: (...args: Args) => Promise<R>;
    /** Status of the most recent run. */
    status: WorkerStatus;
    /** Result of the most recent successful run. */
    result: R | undefined;
    /** Error from the most recent failed run. */
    error: Error | null;
    /** Kill the worker and reject pending runs. The next `run` starts a fresh worker. */
    terminate: () => void;
    isSupported: boolean;
}

interface PendingRun {
    resolve: (value: never) => void;
    reject: (reason: Error) => void;
    timer: ReturnType<typeof setTimeout> | null;
}

interface WorkerHandle {
    worker: Worker;
    url: string;
    source: string;
}

interface WorkerReply {
    id: number;
    ok: boolean;
    result?: unknown;
    error?: {name: string; message: string};
}

function buildSource(fn: (...args: never[]) => unknown) {
    return `const __fn = (${fn.toString()});
self.onmessage = async (event) => {
    const {id, args} = event.data;
    try {
        const result = await __fn(...args);
        self.postMessage({id, ok: true, result});
    } catch (err) {
        const error = err instanceof Error ? {name: err.name, message: err.message} : {name: 'Error', message: String(err)};
        self.postMessage({id, ok: false, error});
    }
};`;
}

function namedError(name: string, message: string) {
    const error = new Error(message);
    error.name = name;
    return error;
}

/**
 * Run a pure function in a Web Worker so heavy work does not block the main thread.
 * The function is serialized with `toString()`, so it must be self-contained: no closures, imports or outer variables.
 * @example
 * const {run, status} = useWorker((n: number) => { let s = 0; for (let i = 0; i < n; i++) s += Math.sqrt(i); return s; });
 * const total = await run(1e9);
 */
export function useWorker<Args extends unknown[], R>(
    fn: (...args: Args) => R | Promise<R>,
    options: WorkerOptions = {}
): WorkerResult<Args, Awaited<R>> {
    const isSupported = !isBrowser || (typeof Worker !== 'undefined' && typeof URL.createObjectURL === 'function');
    const [status, setStatus] = useState<WorkerStatus>('idle');
    const [result, setResult] = useState<Awaited<R> | undefined>(undefined);
    const [error, setError] = useState<Error | null>(null);

    const fnRef = useLatest(fn);
    const optionsRef = useLatest(options);
    const handleRef = useRef<WorkerHandle | null>(null);
    const pendingRef = useRef(new Map<number, PendingRun>());
    const nextIdRef = useRef(0);
    const latestIdRef = useRef(0);
    const mountedRef = useRef(true);

    const dispose = useCallback((reason: Error | null) => {
        const handle = handleRef.current;
        handleRef.current = null;
        if (handle) {
            handle.worker.terminate();
            URL.revokeObjectURL(handle.url);
        }
        pendingRef.current.forEach((pending) => {
            if (pending.timer !== null) clearTimeout(pending.timer);
            if (reason) pending.reject(reason);
        });
        pendingRef.current.clear();
    }, []);

    const settle = useCallback((id: number, next: WorkerStatus, value?: Awaited<R>, reason?: Error) => {
        if (!mountedRef.current || id !== latestIdRef.current) return;
        setStatus(next);
        if (next === 'success') {
            setResult(() => value);
            setError(null);
        } else if (reason) {
            setError(reason);
        }
    }, []);

    const getWorker = useCallback(() => {
        const source = buildSource(fnRef.current as (...args: never[]) => unknown);
        const current = handleRef.current;
        if (current && current.source === source) return current.worker;
        // The function body changed: retire the old worker (its pending runs are rejected).
        if (current) dispose(namedError('AbortError', 'The worker function changed.'));

        const url = URL.createObjectURL(new Blob([source], {type: 'text/javascript'}));
        const worker = new Worker(url);
        handleRef.current = {worker, url, source};

        worker.onmessage = (event: MessageEvent<WorkerReply>) => {
            const {id, ok, result: value, error: failure} = event.data;
            const pending = pendingRef.current.get(id);
            if (!pending) return;
            pendingRef.current.delete(id);
            if (pending.timer !== null) clearTimeout(pending.timer);
            if (ok) {
                pending.resolve(value as never);
                settle(id, 'success', value as Awaited<R>);
            } else {
                const reason = namedError(failure?.name ?? 'Error', failure?.message ?? 'Worker failed.');
                pending.reject(reason);
                settle(id, 'error', undefined, reason);
            }
        };

        // Script-level failures (syntax errors, uncloneable arguments) take the whole worker down.
        worker.onerror = (event: ErrorEvent) => {
            event.preventDefault();
            const reason = namedError('Error', event.message || 'The worker failed to start.');
            const id = latestIdRef.current;
            dispose(reason);
            settle(id, 'error', undefined, reason);
        };

        return worker;
    }, [dispose, fnRef, settle]);

    const run = useCallback((...args: Args) => {
        if (!isBrowser || typeof Worker === 'undefined') {
            return Promise.reject(namedError('NotSupportedError', 'Web Workers are not available.'));
        }

        const id = ++nextIdRef.current;
        latestIdRef.current = id;
        setStatus('running');
        setError(null);

        return new Promise<Awaited<R>>((resolve, reject) => {
            let worker: Worker;
            try {
                worker = getWorker();
            } catch (err) {
                const reason = err instanceof Error ? err : namedError('Error', String(err));
                settle(id, 'error', undefined, reason);
                reject(reason);
                return;
            }

            const pending: PendingRun = {resolve: resolve as (value: never) => void, reject, timer: null};
            const timeout = optionsRef.current.timeout;
            if (timeout !== undefined && timeout > 0) {
                pending.timer = setTimeout(() => {
                    const reason = namedError('TimeoutError', `The worker did not finish within ${timeout}ms.`);
                    // A busy worker cannot be interrupted, only terminated. Other queued runs die with it.
                    pendingRef.current.delete(id);
                    reject(reason);
                    const latest = latestIdRef.current;
                    const abort = namedError('AbortError', 'The worker was terminated after another run timed out.');
                    const latestWasQueued = latest !== id && pendingRef.current.has(latest);
                    dispose(abort);
                    settle(id, 'timeout', undefined, reason);
                    if (latestWasQueued) settle(latest, 'error', undefined, abort);
                }, timeout);
            }
            pendingRef.current.set(id, pending);

            try {
                worker.postMessage({id, args});
            } catch (err) {
                pendingRef.current.delete(id);
                if (pending.timer !== null) clearTimeout(pending.timer);
                const reason = err instanceof Error ? err : namedError('DataCloneError', String(err));
                settle(id, 'error', undefined, reason);
                reject(reason);
            }
        });
    }, [dispose, getWorker, optionsRef, settle]);

    const terminate = useCallback(() => {
        dispose(namedError('AbortError', 'The worker was terminated.'));
        latestIdRef.current = ++nextIdRef.current;
        setStatus('idle');
    }, [dispose]);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            dispose(namedError('AbortError', 'The component unmounted.'));
        };
    }, [dispose]);

    return {run, status, result, error, terminate, isSupported};
}
