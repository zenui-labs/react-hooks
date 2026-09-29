import {useCallback, useEffect, useRef, useState} from 'react';

export interface StopwatchLap {
    /** 1-based lap number. */
    index: number;
    /** Duration of this lap in milliseconds. */
    split: number;
    /** Total elapsed time when the lap was recorded. */
    total: number;
}

export interface StopwatchOptions {
    /** Start on mount. Defaults to false. */
    autoStart?: boolean;
    /** Milliseconds between updates. Defaults to every animation frame. */
    interval?: number;
}

export interface StopwatchResult {
    /** Elapsed milliseconds, excluding paused time. */
    elapsed: number;
    /** Recorded laps, oldest first. */
    laps: StopwatchLap[];
    isRunning: boolean;
    start: () => void;
    pause: () => void;
    /** Start when paused, pause when running. */
    toggle: () => void;
    /** Stop, zero the clock and clear laps. */
    reset: () => void;
    /** Record a lap at the current time. Returns the lap, or `null` when nothing has elapsed. */
    lap: () => StopwatchLap | null;
    /** Read the exact elapsed time now, without waiting for the next update. */
    getElapsed: () => number;
}

const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

/**
 * A stopwatch with laps. Elapsed time comes from a monotonic clock rather than counting ticks,
 * so it stays accurate when updates are throttled.
 * @example
 * const {elapsed, laps, start, pause, lap} = useStopwatch();
 * return <button onClick={lap}>Lap {laps.length + 1} at {(elapsed / 1000).toFixed(2)}s</button>;
 */
export function useStopwatch(options: StopwatchOptions = {}): StopwatchResult {
    const {autoStart = false, interval} = options;
    const [elapsed, setElapsed] = useState(0);
    const [laps, setLaps] = useState<StopwatchLap[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    // Time banked from earlier runs plus the start of the current run.
    const bankedRef = useRef(0);
    const startedAtRef = useRef<number | null>(null);
    const lapsRef = useRef<StopwatchLap[]>([]);

    const getElapsed = useCallback(() => {
        const startedAt = startedAtRef.current;
        return bankedRef.current + (startedAt === null ? 0 : now() - startedAt);
    }, []);

    const start = useCallback(() => {
        if (startedAtRef.current !== null) return;
        startedAtRef.current = now();
        setIsRunning(true);
    }, []);

    const pause = useCallback(() => {
        if (startedAtRef.current === null) return;
        bankedRef.current = getElapsed();
        startedAtRef.current = null;
        setElapsed(bankedRef.current);
        setIsRunning(false);
    }, [getElapsed]);

    const toggle = useCallback(() => {
        if (startedAtRef.current === null) start();
        else pause();
    }, [start, pause]);

    const reset = useCallback(() => {
        bankedRef.current = 0;
        startedAtRef.current = null;
        lapsRef.current = [];
        setElapsed(0);
        setLaps([]);
        setIsRunning(false);
    }, []);

    const lap = useCallback(() => {
        const total = getElapsed();
        const previous = lapsRef.current[lapsRef.current.length - 1];
        const split = total - (previous ? previous.total : 0);
        if (split <= 0) return null;
        const entry: StopwatchLap = {index: lapsRef.current.length + 1, split, total};
        lapsRef.current = [...lapsRef.current, entry];
        setLaps(lapsRef.current);
        return entry;
    }, [getElapsed]);

    useEffect(() => {
        if (!isRunning) return;
        const update = () => setElapsed(getElapsed());

        if (interval !== undefined || typeof requestAnimationFrame === 'undefined') {
            const id = setInterval(update, interval ?? 16);
            return () => clearInterval(id);
        }

        let frame = 0;
        const loop = () => {
            update();
            frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frame);
    }, [isRunning, interval, getElapsed]);

    useEffect(() => {
        if (autoStart) start();
        // Only on mount: autoStart is an initial setting.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {elapsed, laps, isRunning, start, pause, toggle, reset, lap, getElapsed};
}
