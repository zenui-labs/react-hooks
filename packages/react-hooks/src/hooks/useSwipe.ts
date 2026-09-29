import {useCallback, useEffect, useState} from 'react';
import {useLatest} from './useLatest';

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

export type SwipeAxis = 'x' | 'y' | 'both';

export interface SwipeEvent {
    direction: SwipeDirection;
    deltaX: number;
    deltaY: number;
    /** Distance along the swipe direction, in pixels. */
    distance: number;
    /** Release speed along the swipe direction, in pixels per millisecond. */
    velocity: number;
    /** Time from press to release, in milliseconds. */
    duration: number;
}

export interface SwipeOptions {
    /** Minimum distance in pixels. Defaults to 50. */
    threshold?: number;
    /** A faster flick counts as a swipe even below `threshold`. Pixels per millisecond. Defaults to 0.5. */
    velocityThreshold?: number;
    /** Directions to detect. `'x'` keeps vertical page scrolling on touch screens. Defaults to `'both'`. */
    axis?: SwipeAxis;
    onSwipe?: (swipe: SwipeEvent) => void;
    onSwipeLeft?: (swipe: SwipeEvent) => void;
    onSwipeRight?: (swipe: SwipeEvent) => void;
    onSwipeUp?: (swipe: SwipeEvent) => void;
    onSwipeDown?: (swipe: SwipeEvent) => void;
}

export interface SwipeResult<T extends HTMLElement> {
    /** Callback ref for the swipe surface. */
    ref: (node: T | null) => void;
    /** Direction of the most recent swipe, or `null` before the first one. */
    direction: SwipeDirection | null;
    isSwiping: boolean;
    /** Live horizontal offset from the press point. Resets to 0 on release. */
    deltaX: number;
    /** Live vertical offset from the press point. Resets to 0 on release. */
    deltaY: number;
}

interface Sample {
    t: number;
    x: number;
    y: number;
}

interface SwipeState {
    isSwiping: boolean;
    deltaX: number;
    deltaY: number;
}

const IDLE: SwipeState = {isSwiping: false, deltaX: 0, deltaY: 0};
const VELOCITY_WINDOW = 100;
const MIN_FLICK_DISTANCE = 10;

function directionOf(dx: number, dy: number, axis: SwipeAxis): SwipeDirection | null {
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    if (axis === 'x' && !horizontal) return null;
    if (axis === 'y' && horizontal) return null;
    if (horizontal) return dx === 0 ? null : dx < 0 ? 'left' : 'right';
    return dy < 0 ? 'up' : 'down';
}

/**
 * Detect swipe gestures from mouse, touch or pen, with live offsets for drag-to-dismiss UIs.
 * A swipe counts when the distance passes `threshold`, or when a quick flick passes `velocityThreshold`.
 * @example
 * const {ref, deltaX} = useSwipe<HTMLDivElement>({axis: 'x', onSwipeLeft: () => archive(message)});
 * return <div ref={ref} style={{transform: `translateX(${deltaX}px)`}}>{message.subject}</div>;
 */
export function useSwipe<T extends HTMLElement = HTMLElement>(options: SwipeOptions = {}): SwipeResult<T> {
    const {axis = 'both'} = options;
    const optionsRef = useLatest(options);
    const [node, setNode] = useState<T | null>(null);
    const [state, setState] = useState<SwipeState>(IDLE);
    const [direction, setDirection] = useState<SwipeDirection | null>(null);

    const ref = useCallback((element: T | null) => setNode(element), []);

    useEffect(() => {
        if (!node) return;
        const element = node;

        // Let the browser keep scrolling along the axis we do not handle.
        const previousTouchAction = element.style.touchAction;
        element.style.touchAction = axis === 'x' ? 'pan-y' : axis === 'y' ? 'pan-x' : 'none';

        let pointerId: number | null = null;
        let start: Sample = {t: 0, x: 0, y: 0};
        let samples: Sample[] = [];

        const preventDefault = (event: Event) => event.preventDefault();

        const stop = () => {
            pointerId = null;
            samples = [];
            document.removeEventListener('selectstart', preventDefault);
            setState(IDLE);
        };

        const onPointerDown = (event: PointerEvent) => {
            if (pointerId !== null || !event.isPrimary) return;
            if (event.pointerType === 'mouse' && event.button !== 0) return;
            pointerId = event.pointerId;
            start = {t: event.timeStamp, x: event.clientX, y: event.clientY};
            samples = [start];
            try {
                element.setPointerCapture(event.pointerId);
            } catch {
                // Capture is optional; moves still arrive while the pointer is over the element.
            }
            document.addEventListener('selectstart', preventDefault);
            setState({isSwiping: true, deltaX: 0, deltaY: 0});
        };

        const onPointerMove = (event: PointerEvent) => {
            if (event.pointerId !== pointerId) return;
            const sample = {t: event.timeStamp, x: event.clientX, y: event.clientY};
            samples.push(sample);
            while (samples.length > 2 && sample.t - samples[0].t > VELOCITY_WINDOW) samples.shift();
            setState({
                isSwiping: true,
                deltaX: axis === 'y' ? 0 : sample.x - start.x,
                deltaY: axis === 'x' ? 0 : sample.y - start.y,
            });
        };

        const onPointerUp = (event: PointerEvent) => {
            if (event.pointerId !== pointerId) return;
            const opts = optionsRef.current;
            const dx = event.clientX - start.x;
            const dy = event.clientY - start.y;
            const found = directionOf(dx, dy, axis);

            if (found) {
                const first = samples[0] ?? start;
                const elapsed = event.timeStamp - first.t;
                const horizontal = found === 'left' || found === 'right';
                const travelled = horizontal ? event.clientX - first.x : event.clientY - first.y;
                const sign = found === 'left' || found === 'up' ? -1 : 1;
                const velocity = elapsed > 0 ? Math.max(0, (travelled * sign) / elapsed) : 0;
                const distance = Math.abs(horizontal ? dx : dy);
                const threshold = opts.threshold ?? 50;
                const velocityThreshold = opts.velocityThreshold ?? 0.5;

                if (distance >= threshold || (distance >= MIN_FLICK_DISTANCE && velocity >= velocityThreshold)) {
                    const swipe: SwipeEvent = {
                        direction: found,
                        deltaX: dx,
                        deltaY: dy,
                        distance,
                        velocity,
                        duration: event.timeStamp - start.t,
                    };
                    setDirection(found);
                    opts.onSwipe?.(swipe);
                    if (found === 'left') opts.onSwipeLeft?.(swipe);
                    else if (found === 'right') opts.onSwipeRight?.(swipe);
                    else if (found === 'up') opts.onSwipeUp?.(swipe);
                    else opts.onSwipeDown?.(swipe);
                }
            }
            stop();
        };

        const onPointerCancel = (event: PointerEvent) => {
            if (event.pointerId === pointerId) stop();
        };

        element.addEventListener('pointerdown', onPointerDown);
        element.addEventListener('pointermove', onPointerMove);
        element.addEventListener('pointerup', onPointerUp);
        element.addEventListener('pointercancel', onPointerCancel);
        element.addEventListener('dragstart', preventDefault);

        return () => {
            element.removeEventListener('pointerdown', onPointerDown);
            element.removeEventListener('pointermove', onPointerMove);
            element.removeEventListener('pointerup', onPointerUp);
            element.removeEventListener('pointercancel', onPointerCancel);
            element.removeEventListener('dragstart', preventDefault);
            if (pointerId !== null) stop();
            element.style.touchAction = previousTouchAction;
        };
    }, [node, axis, optionsRef]);

    return {ref, direction, isSwiping: state.isSwiping, deltaX: state.deltaX, deltaY: state.deltaY};
}
