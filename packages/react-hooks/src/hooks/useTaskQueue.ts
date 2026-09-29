import {useCallback, useEffect, useRef, useState} from 'react';
import {useIsMounted} from './useIsMounted';
import {useLatest} from './useLatest';

export type TaskQueueStatus = 'pending' | 'running' | 'done' | 'failed';

/** A unit of async work. The signal aborts when the component unmounts. */
export type TaskQueueFn<R> = (signal: AbortSignal) => Promise<R>;

export interface TaskQueueOptions {
    /** Maximum number of tasks running at once. Defaults to 2. */
    concurrency?: number;
    /** Start paused. Defaults to false. */
    paused?: boolean;
}

export interface TaskQueueTask<R = unknown> {
    id: number;
    label: string;
    status: TaskQueueStatus;
    /** `Date.now()` when the task was added, started and finished. */
    addedAt: number;
    startedAt: number | null;
    finishedAt: number | null;
    /** Milliseconds from start to finish, or null until the task settles. */
    duration: number | null;
    result: R | undefined;
    error: Error | null;
}

export interface TaskQueue<R = unknown> {
    /** Queue a task. Returns its id. */
    add: (task: TaskQueueFn<R>, label?: string) => number;
    /** Every task still in the list, in the order added. */
    tasks: readonly TaskQueueTask<R>[];
    running: number;
    pending: number;
    isPaused: boolean;
    /** Drop pending and finished tasks. Running tasks keep going. */
    clear: () => void;
    /** Stop starting new tasks. Running tasks finish normally. */
    pause: () => void;
    resume: () => void;
}

interface TaskRecord<R> extends TaskQueueTask<R> {
    run: TaskQueueFn<R>;
}

function toPublic<R>({run: _run, ...task}: TaskRecord<R>): TaskQueueTask<R> {
    return task;
}

/**
 * Run async tasks with a concurrency limit, in the order they were added.
 * @example
 * const {add, tasks, running} = useTaskQueue({concurrency: 3});
 * files.forEach((file) => add((signal) => upload(file, {signal}), file.name));
 */
export function useTaskQueue<R = unknown>(options: TaskQueueOptions = {}): TaskQueue<R> {
    const concurrency = Math.max(1, Math.floor(options.concurrency ?? 2));
    const concurrencyRef = useLatest(concurrency);
    const isMounted = useIsMounted();

    const recordsRef = useRef<TaskRecord<R>[]>([]);
    const pausedRef = useRef(options.paused ?? false);
    const nextId = useRef(0);
    const controllerRef = useRef<AbortController | null>(null);

    const [tasks, setTasks] = useState<readonly TaskQueueTask<R>[]>([]);
    const [isPaused, setIsPaused] = useState(pausedRef.current);

    const publish = useCallback(() => {
        if (isMounted()) {
            setTasks(recordsRef.current.map(toPublic));
        }
    }, [isMounted]);

    const replace = useCallback((id: number, patch: Partial<TaskRecord<R>>) => {
        recordsRef.current = recordsRef.current.map((task) => task.id === id ? {...task, ...patch} : task);
    }, []);

    const pump = useCallback(() => {
        if (!isMounted()) {
            return;
        }

        let changed = false;

        while (!pausedRef.current) {
            const records = recordsRef.current;
            const active = records.filter((task) => task.status === 'running').length;
            const next = records.find((task) => task.status === 'pending');

            if (!next || active >= concurrencyRef.current) {
                break;
            }

            const startedAt = Date.now();
            replace(next.id, {status: 'running', startedAt});
            changed = true;

            if (!controllerRef.current) {
                controllerRef.current = new AbortController();
            }

            const finish = (patch: Partial<TaskRecord<R>>) => {
                const finishedAt = Date.now();
                replace(next.id, {...patch, finishedAt, duration: finishedAt - startedAt});
                publish();
                pump();
            };

            Promise.resolve()
                .then(() => next.run(controllerRef.current!.signal))
                .then(
                    (result) => finish({status: 'done', result}),
                    (reason: unknown) => finish({
                        status: 'failed',
                        error: reason instanceof Error ? reason : new Error(String(reason)),
                    })
                );
        }

        if (changed) {
            publish();
        }
    }, [concurrencyRef, isMounted, publish, replace]);

    const add = useCallback((run: TaskQueueFn<R>, label?: string) => {
        const id = ++nextId.current;

        recordsRef.current = [...recordsRef.current, {
            id,
            label: label ?? `Task ${id}`,
            status: 'pending',
            addedAt: Date.now(),
            startedAt: null,
            finishedAt: null,
            duration: null,
            result: undefined,
            error: null,
            run,
        }];
        publish();
        pump();

        return id;
    }, [publish, pump]);

    const clear = useCallback(() => {
        recordsRef.current = recordsRef.current.filter((task) => task.status === 'running');
        publish();
    }, [publish]);

    const pause = useCallback(() => {
        pausedRef.current = true;
        setIsPaused(true);
    }, []);

    const resume = useCallback(() => {
        pausedRef.current = false;
        setIsPaused(false);
        pump();
    }, [pump]);

    // Start more tasks when the limit goes up.
    useEffect(() => {
        pump();
    }, [concurrency, pump]);

    // Abort running work on unmount. A fresh controller is created on the next run.
    useEffect(() => () => {
        controllerRef.current?.abort();
        controllerRef.current = null;
    }, []);

    let running = 0;
    let pending = 0;
    for (const task of tasks) {
        if (task.status === 'running') running++;
        else if (task.status === 'pending') pending++;
    }

    return {add, tasks, running, pending, isPaused, clear, pause, resume};
}
