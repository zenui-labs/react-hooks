import {useCallback, useEffect, useState} from 'react';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

export type ResizeObserverHookBox = 'content-box' | 'border-box' | 'device-pixel-content-box';

export interface ResizeObserverHookOptions {
    /** Which box to report. Defaults to `'content-box'`. */
    box?: ResizeObserverHookBox;
}

export interface ResizeObserverHookResult<T extends Element> {
    /** Callback ref. Attach it to the element to observe; swapping elements re-observes. */
    ref: (node: T | null) => void;
    width: number;
    height: number;
    /** The latest raw entry, or `null` before the first measurement. */
    entry: ResizeObserverEntry | null;
    isSupported: boolean;
}

interface ResizeState {
    width: number;
    height: number;
    entry: ResizeObserverEntry | null;
}

function firstSize(list: ReadonlyArray<ResizeObserverSize> | ResizeObserverSize | undefined) {
    if (!list) return null;
    // Older Safari exposes a single object instead of an array.
    if ('length' in list) return list.length ? list[0] : null;
    return list;
}

function readSize(entry: ResizeObserverEntry, box: ResizeObserverHookBox) {
    const size = box === 'border-box'
        ? firstSize(entry.borderBoxSize)
        : box === 'device-pixel-content-box'
            ? firstSize(entry.devicePixelContentBoxSize)
            : null;

    if (size) return {width: size.inlineSize, height: size.blockSize};
    return {width: entry.contentRect.width, height: entry.contentRect.height};
}

/**
 * Track an element's size with `ResizeObserver`. Updates are batched to one per animation frame.
 * @example
 * const {ref, width, height} = useResizeObserver<HTMLDivElement>();
 * return <div ref={ref}>{Math.round(width)} x {Math.round(height)}</div>;
 */
export function useResizeObserver<T extends Element = HTMLElement>(
    options: ResizeObserverHookOptions = {}
): ResizeObserverHookResult<T> {
    const {box = 'content-box'} = options;
    const [node, setNode] = useState<T | null>(null);
    const [state, setState] = useState<ResizeState>({width: 0, height: 0, entry: null});
    const [isSupported, setIsSupported] = useState(false);

    const ref = useCallback((element: T | null) => setNode(element), []);

    useIsomorphicLayoutEffect(() => {
        setIsSupported(typeof ResizeObserver !== 'undefined');
    }, []);

    useEffect(() => {
        if (!node || typeof ResizeObserver === 'undefined') return;

        let frame = 0;
        let pending: ResizeObserverEntry | null = null;

        const flush = () => {
            frame = 0;
            const entry = pending;
            pending = null;
            if (!entry) return;
            const {width, height} = readSize(entry, box);
            setState({width, height, entry});
        };

        const observer = new ResizeObserver((entries) => {
            pending = entries[entries.length - 1];
            if (!frame) frame = requestAnimationFrame(flush);
        });

        try {
            observer.observe(node, {box});
        } catch {
            // Browsers without device-pixel-content-box support throw; fall back to the content box.
            observer.observe(node);
        }

        return () => {
            observer.disconnect();
            if (frame) cancelAnimationFrame(frame);
        };
    }, [node, box]);

    return {ref, width: state.width, height: state.height, entry: state.entry, isSupported};
}
