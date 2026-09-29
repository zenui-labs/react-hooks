import {useCallback, useEffect, useRef, useState} from 'react';
import {isBrowser} from '../utils/env';
import {useLatest} from './useLatest';

export interface SpringValueOptions {
    /** Spring stiffness. Higher is snappier. Defaults to 170. */
    stiffness?: number;
    /** Friction. Lower values overshoot and wobble more. Defaults to 26. */
    damping?: number;
    /** Mass of the moving object. Heavier is slower to start and stop. Defaults to 1. */
    mass?: number;
    /** The spring rests once both distance and velocity are below this. Defaults to 0.01. */
    precision?: number;
    /** Jump straight to the target when the user prefers reduced motion. Defaults to true. */
    respectReducedMotion?: boolean;
    /** Called when the spring comes to rest. */
    onRest?: (value: number) => void;
}

export interface SpringValueResult {
    value: number;
    /** Units per second. */
    velocity: number;
    isAnimating: boolean;
    /** Move toward `value`, or jump there with `immediate`. The `target` argument takes over again when it changes. */
    set: (value: number, immediate?: boolean) => void;
    /** True when the spring is skipping animation because of `prefers-reduced-motion`. */
    isReducedMotion: boolean;
}

interface SpringState {
    value: number;
    velocity: number;
    isAnimating: boolean;
}

// Fixed physics step keeps the simulation stable regardless of frame rate.
const STEP = 1 / 1000;
// Cap the time simulated per frame so a long pause (hidden tab) does not jump.
const MAX_FRAME = 0.064;

/**
 * Animate a number toward a target with spring physics on `requestAnimationFrame`.
 * Use the value for transforms, counters or anything that should settle naturally instead of on a fixed curve.
 * @example
 * const [open, setOpen] = useState(false);
 * const {value} = useSpringValue(open ? 240 : 0, {stiffness: 220, damping: 18});
 * return <div style={{height: value, overflow: 'hidden'}}>...</div>;
 */
export function useSpringValue(target: number, options: SpringValueOptions = {}): SpringValueResult {
    const {respectReducedMotion = true} = options;
    const [state, setState] = useState<SpringState>({value: target, velocity: 0, isAnimating: false});
    const [prefersReduced, setPrefersReduced] = useState(false);

    const optionsRef = useLatest(options);
    const valueRef = useRef(target);
    const velocityRef = useRef(0);
    const goalRef = useRef(target);
    const frameRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number | null>(null);
    const reducedRef = useRef(false);

    const stopLoop = useCallback(() => {
        if (frameRef.current !== null && typeof cancelAnimationFrame !== 'undefined') {
            cancelAnimationFrame(frameRef.current);
        }
        frameRef.current = null;
        lastTimeRef.current = null;
    }, []);

    const jump = useCallback((value: number) => {
        stopLoop();
        valueRef.current = value;
        velocityRef.current = 0;
        setState({value, velocity: 0, isAnimating: false});
    }, [stopLoop]);

    const frame: (time: number) => void = useCallback((time: number) => {
        const {stiffness = 170, damping = 26, mass = 1, precision = 0.01} = optionsRef.current;
        const last = lastTimeRef.current ?? time;
        lastTimeRef.current = time;
        let remaining = Math.min((time - last) / 1000, MAX_FRAME);

        let x = valueRef.current;
        let v = velocityRef.current;
        const goal = goalRef.current;
        while (remaining > 0) {
            const dt = Math.min(STEP, remaining);
            // Semi-implicit Euler: update velocity first, then position with the new velocity.
            const force = -stiffness * (x - goal) - damping * v;
            v += (force / Math.max(mass, 0.0001)) * dt;
            x += v * dt;
            remaining -= dt;
        }

        const resting = Math.abs(v) < precision && Math.abs(x - goal) < precision;
        if (resting || !Number.isFinite(x)) {
            frameRef.current = null;
            lastTimeRef.current = null;
            valueRef.current = goal;
            velocityRef.current = 0;
            setState({value: goal, velocity: 0, isAnimating: false});
            optionsRef.current.onRest?.(goal);
            return;
        }

        valueRef.current = x;
        velocityRef.current = v;
        setState({value: x, velocity: v, isAnimating: true});
        frameRef.current = requestAnimationFrame(frame);
    }, [optionsRef]);

    const animateTo = useCallback((goal: number, immediate = false) => {
        if (!Number.isFinite(goal)) return;
        goalRef.current = goal;
        const skip = immediate || typeof requestAnimationFrame === 'undefined'
            || (reducedRef.current && optionsRef.current.respectReducedMotion !== false);
        if (skip) {
            jump(goal);
            optionsRef.current.onRest?.(goal);
            return;
        }
        if (frameRef.current === null) {
            setState((prev) => (prev.isAnimating ? prev : {...prev, isAnimating: true}));
            frameRef.current = requestAnimationFrame(frame);
        }
    }, [frame, jump, optionsRef]);

    useEffect(() => {
        if (goalRef.current !== target || valueRef.current !== target) animateTo(target);
    }, [target, animateTo]);

    useEffect(() => {
        if (!isBrowser || typeof window.matchMedia !== 'function') return;
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => {
            reducedRef.current = query.matches;
            setPrefersReduced(query.matches);
            if (query.matches && frameRef.current !== null && optionsRef.current.respectReducedMotion !== false) {
                jump(goalRef.current);
            }
        };
        update();
        query.addEventListener?.('change', update);
        return () => query.removeEventListener?.('change', update);
    }, [jump, optionsRef]);

    useEffect(() => stopLoop, [stopLoop]);

    return {
        value: state.value,
        velocity: state.velocity,
        isAnimating: state.isAnimating,
        set: animateTo,
        isReducedMotion: respectReducedMotion && prefersReduced,
    };
}
