import {useCallback, useEffect, useRef, useState} from 'react';
import {useLatest} from './useLatest';

/** A `Date` counts down to that moment. A number is a duration in milliseconds. */
export type CountdownTarget = Date | number;

export interface CountdownOptions {
    /** How often to update, in milliseconds. Updates land on interval boundaries of the remaining time. Defaults to 1000. */
    interval?: number;
    /** Start counting on mount. Defaults to true. */
    autoStart?: boolean;
    /** Called once when the countdown reaches zero. */
    onComplete?: () => void;
}

export interface CountdownResult {
    /** Milliseconds left. */
    remaining: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    /** Fraction of the duration that has elapsed, from 0 to 1. */
    progress: number;
    isRunning: boolean;
    isComplete: boolean;
    /** Start counting. Restarts from the full duration when the countdown is complete. */
    start: () => void;
    pause: () => void;
    resume: () => void;
    /** Stop and restore the full duration, optionally with a new target. */
    reset: (target?: CountdownTarget) => void;
}

function durationOf(target: CountdownTarget) {
    const ms = target instanceof Date ? target.getTime() - Date.now() : target;
    return Number.isFinite(ms) ? Math.max(0, ms) : 0;
}

/**
 * Count down to a date or through a duration without drift. Time left is always computed from the clock,
 * so a throttled background tab catches up on its next update.
 * @example
 * const {minutes, seconds, isComplete} = useCountdown(5 * 60 * 1000, {onComplete: submitQuiz});
 * return <span>{minutes}:{String(seconds).padStart(2, '0')}</span>;
 */
export function useCountdown(target: CountdownTarget, options: CountdownOptions = {}): CountdownResult {
    const {interval = 1000, autoStart = true} = options;
    const [total, setTotal] = useState(() => durationOf(target));
    const [remaining, setRemaining] = useState(total);
    const [isRunning, setIsRunning] = useState(false);

    const onCompleteRef = useLatest(options.onComplete);
    const autoStartRef = useLatest(autoStart);
    const endAtRef = useRef(0);
    const remainingRef = useRef(remaining);
    const totalRef = useRef(total);
    const runningRef = useRef(false);

    const setRunning = useCallback((running: boolean) => {
        runningRef.current = running;
        setIsRunning(running);
    }, []);

    const begin = useCallback((ms: number) => {
        if (runningRef.current || ms <= 0) return;
        endAtRef.current = Date.now() + ms;
        setRunning(true);
    }, [setRunning]);

    const start = useCallback(() => {
        if (runningRef.current) return;
        if (remainingRef.current <= 0) {
            remainingRef.current = totalRef.current;
            setRemaining(totalRef.current);
        }
        begin(remainingRef.current);
    }, [begin]);

    const pause = useCallback(() => {
        if (!runningRef.current) return;
        remainingRef.current = Math.max(0, endAtRef.current - Date.now());
        setRemaining(remainingRef.current);
        setRunning(false);
    }, [setRunning]);

    const resume = useCallback(() => {
        begin(remainingRef.current);
    }, [begin]);

    const reset = useCallback((next?: CountdownTarget) => {
        const ms = next === undefined ? totalRef.current : durationOf(next);
        totalRef.current = ms;
        remainingRef.current = ms;
        setTotal(ms);
        setRemaining(ms);
        setRunning(false);
    }, [setRunning]);

    useEffect(() => {
        if (!isRunning) return;
        let timer: ReturnType<typeof setTimeout>;

        const tick = () => {
            const left = Math.max(0, endAtRef.current - Date.now());
            remainingRef.current = left;
            setRemaining(left);
            if (left <= 0) {
                setRunning(false);
                onCompleteRef.current?.();
                return;
            }
            // Wake exactly when the next interval boundary is crossed so displays flip on time.
            timer = setTimeout(tick, left % interval || interval);
        };

        tick();
        return () => clearTimeout(timer);
    }, [isRunning, interval, onCompleteRef, setRunning]);

    // A new target prop resets the countdown. Dates compare by time so a fresh Date each render is fine.
    const targetKey = target instanceof Date ? `d${target.getTime()}` : `n${target}`;
    const firstRef = useRef(true);
    useEffect(() => {
        if (firstRef.current) {
            firstRef.current = false;
            if (autoStartRef.current) start();
            return;
        }
        reset(target);
        if (autoStartRef.current) start();
    }, [targetKey]);

    const totalSeconds = Math.floor(remaining / 1000);

    return {
        remaining,
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor(totalSeconds / 3600) % 24,
        minutes: Math.floor(totalSeconds / 60) % 60,
        seconds: totalSeconds % 60,
        progress: total > 0 ? 1 - remaining / total : 1,
        isRunning,
        isComplete: remaining <= 0,
        start,
        pause,
        resume,
        reset,
    };
}
