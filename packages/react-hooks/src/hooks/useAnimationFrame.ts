import {useCallback, useEffect, useState} from 'react';
import {useLatest} from './useLatest';

export interface AnimationFrameInfo {
    /** Timestamp from `requestAnimationFrame`, in milliseconds. */
    time: number;
    /** Milliseconds since the previous frame. 0 on the first frame after starting. */
    delta: number;
    /** Frames since the loop started, starting at 0. */
    frame: number;
    /** Milliseconds since the loop started. */
    elapsed: number;
}

export interface AnimationFrameOptions {
    /** Run the loop. Defaults to true. Changing it starts or stops the loop. */
    enabled?: boolean;
}

export interface AnimationFrameResult {
    start: () => void;
    stop: () => void;
    isRunning: boolean;
}

/**
 * Run a callback on every animation frame with the time since the previous frame.
 * The callback can change between renders without restarting the loop, and the loop is cancelled on unmount.
 * @example
 * const angle = useRef(0);
 * useAnimationFrame(({delta}) => {
 *     angle.current += delta * 0.18;
 *     box.current!.style.transform = `rotate(${angle.current}deg)`;
 * });
 */
export function useAnimationFrame(
    callback: (info: AnimationFrameInfo) => void,
    options: AnimationFrameOptions = {}
): AnimationFrameResult {
    const {enabled = true} = options;
    const [isRunning, setIsRunning] = useState(enabled);
    const callbackRef = useLatest(callback);

    useEffect(() => {
        setIsRunning(enabled);
    }, [enabled]);

    useEffect(() => {
        if (!isRunning || typeof requestAnimationFrame === 'undefined') return;
        let handle = 0;
        let first: number | null = null;
        let previous = 0;
        let frame = 0;

        const loop = (time: number) => {
            if (first === null) {
                first = time;
                previous = time;
            }
            callbackRef.current({time, delta: time - previous, frame, elapsed: time - first});
            previous = time;
            frame += 1;
            handle = requestAnimationFrame(loop);
        };

        handle = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(handle);
    }, [isRunning, callbackRef]);

    const start = useCallback(() => setIsRunning(true), []);
    const stop = useCallback(() => setIsRunning(false), []);

    return {start, stop, isRunning};
}
