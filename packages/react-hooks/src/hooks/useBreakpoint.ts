import {useCallback, useEffect, useMemo, useState} from 'react';
import {isBrowser} from '../utils/env';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';
import {useLatest} from './useLatest';

export type BreakpointMap<K extends string = string> = Record<K, number>;

export type DefaultBreakpoint = 'sm' | 'md' | 'lg' | 'xl';

export interface BreakpointOptions {
    /** Update `width` on every resize (at most once per frame). Defaults to `false`. */
    trackWidth?: boolean;
}

export interface BreakpointResult<K extends string> {
    /** The largest breakpoint whose min-width matches, or `null` below the smallest one. */
    current: K | null;
    /**
     * Viewport width in CSS pixels, read at mount and whenever a breakpoint is crossed.
     * With `trackWidth`, also on every resize. `0` on the server and before the first client effect.
     */
    width: number;
    /** True when the viewport is at least as wide as `key`. */
    isAbove: (key: K) => boolean;
    /** True when the viewport is narrower than `key`. */
    isBelow: (key: K) => boolean;
}

const DEFAULT_BREAKPOINTS: BreakpointMap<DefaultBreakpoint> = {sm: 640, md: 768, lg: 1024, xl: 1280};

/**
 * Report the active min-width breakpoint using `matchMedia`. By default the component re-renders
 * only when a breakpoint is crossed; pass `{trackWidth: true}` to also follow the exact width.
 * Matches start as `false` on the server, so hydration is safe.
 *
 * @example
 * const {current, isBelow} = useBreakpoint();
 * return isBelow('md') ? <MobileNav/> : <DesktopNav/>;
 */
export function useBreakpoint<K extends string = DefaultBreakpoint>(
    breakpoints: BreakpointMap<K> = DEFAULT_BREAKPOINTS as BreakpointMap<K>,
    options: BreakpointOptions = {}
): BreakpointResult<K> {
    const {trackWidth = false} = options;
    const [matches, setMatches] = useState<Partial<Record<K, boolean>>>({});
    const [width, setWidth] = useState(0);
    const breakpointsRef = useLatest(breakpoints);
    // Inline objects get a new identity every render; re-subscribe only when the values change.
    const signature = (Object.keys(breakpoints) as K[])
        .map((key) => `${key}:${breakpoints[key]}`)
        .join('|');

    useIsomorphicLayoutEffect(() => {
        if (!isBrowser || typeof window.matchMedia !== 'function') return;

        const map = breakpointsRef.current;
        const keys = Object.keys(map) as K[];
        const lists = keys.map((key) => [key, window.matchMedia(`(min-width: ${map[key]}px)`)] as const);

        const read = () => {
            const next: Partial<Record<K, boolean>> = {};
            lists.forEach(([key, mql]) => {
                next[key] = mql.matches;
            });
            setMatches(next);
            setWidth(window.innerWidth);
        };
        read();

        lists.forEach(([, mql]) => {
            if (typeof mql.addEventListener === 'function') mql.addEventListener('change', read);
            else mql.addListener(read);
        });
        return () => {
            lists.forEach(([, mql]) => {
                if (typeof mql.removeEventListener === 'function') mql.removeEventListener('change', read);
                else mql.removeListener(read);
            });
        };
    }, [signature, breakpointsRef]);

    // Opt-in: following the exact width re-renders on every resize frame.
    useEffect(() => {
        if (!trackWidth || !isBrowser) return;

        let frame = 0;
        const measure = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => setWidth(window.innerWidth));
        };
        setWidth(window.innerWidth);
        window.addEventListener('resize', measure);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', measure);
        };
    }, [trackWidth]);

    const current = useMemo((): K | null => {
        const map = breakpointsRef.current;
        let best: K | null = null;
        for (const key of Object.keys(map) as K[]) {
            if (matches[key] && (best === null || map[key] > map[best])) best = key;
        }
        return best;
    }, [matches, breakpointsRef]);

    const isAbove = useCallback((key: K) => !!matches[key], [matches]);
    const isBelow = useCallback((key: K) => matches[key] === false, [matches]);

    return {current, width, isAbove, isBelow};
}
