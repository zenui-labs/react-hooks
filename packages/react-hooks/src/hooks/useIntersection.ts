import {RefObject, useEffect, useRef, useState} from 'react';
import {IntersectionOptions} from '../types';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

/**
 * Report whether the element attached to `ref` is inside the viewport (or `options.root`).
 * Options are compared by value, so an inline object does not recreate the observer.
 * @example
 * const {ref, isIntersecting} = useIntersection<HTMLDivElement>({threshold: 0.5, once: true});
 * <div ref={ref}>{isIntersecting ? 'Visible' : 'Hidden'}</div>
 */
export function useIntersection<T extends HTMLElement = HTMLElement>(
    options: IntersectionOptions = {}
) {
    const {root = null, rootMargin, threshold, once = false} = options;
    const ref = useRef<T | null>(null);
    const [node, setNode] = useState<T | null>(null);
    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

    // Pick up the element after every commit, so conditionally rendered targets are observed too.
    useIsomorphicLayoutEffect(() => {
        if (ref.current !== node) setNode(ref.current);
    });

    const thresholdKey = Array.isArray(threshold) ? threshold.join(',') : String(threshold ?? 0);
    const frozen = once && !!entry?.isIntersecting;

    useEffect(() => {
        if (!node || frozen || typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(([next]) => {
            setEntry(next);
            if (once && next.isIntersecting) observer.disconnect();
        }, {
            root,
            rootMargin,
            threshold: thresholdKey.split(',').map(Number),
        });

        observer.observe(node);

        return () => observer.disconnect();
    }, [node, root, rootMargin, thresholdKey, once, frozen]);

    return {ref, isIntersecting: entry?.isIntersecting ?? false, entry} as {
        ref: RefObject<T>;
        isIntersecting: boolean;
        entry: IntersectionObserverEntry | null;
    };
}
