import {useCallback, useEffect, useRef, useState} from 'react';
import {isBrowser} from '../utils/env';
import {useIsMounted} from './useIsMounted';
import {useLatest} from './useLatest';

export interface InfiniteScrollOptions {
    /** Load the next page. Return a promise so the hook knows when loading ends. */
    loadMore: () => Promise<unknown> | void;
    /** Whether there is anything left to load. The observer disconnects when false. */
    hasMore: boolean;
    /** Margin around the root that counts as visible. Defaults to `'200px'` so pages load before the end is reached. */
    rootMargin?: string;
    /** Scroll container to observe against. Defaults to the viewport. */
    root?: Element | null | { readonly current: Element | null };
    /** Pause loading without unmounting the sentinel. Defaults to false. */
    disabled?: boolean;
}

export interface InfiniteScrollResult<T extends Element> {
    /** Callback ref for the element placed after the last item. */
    sentinelRef: (node: T | null) => void;
    isLoading: boolean;
    /** The error thrown by the last `loadMore`. Loading stops until `retry` is called. */
    error: unknown;
    /** Clear the error and load again. Also works as a manual "load more" when IntersectionObserver is missing. */
    retry: () => void;
    isSupported: boolean;
}

function resolveRoot(root: InfiniteScrollOptions['root']): Element | null {
    if (!root) return null;
    return 'current' in root ? root.current : root;
}

/**
 * Load the next page when a sentinel element scrolls into view.
 * Never fires while a load is running, and keeps loading while the sentinel stays visible.
 * @example
 * const {sentinelRef, isLoading} = useInfiniteScroll({loadMore: fetchNextPage, hasMore});
 * return <ul>{items.map(renderItem)}<li ref={sentinelRef}>{isLoading && 'Loading'}</li></ul>;
 */
export function useInfiniteScroll<T extends Element = HTMLElement>(options: InfiniteScrollOptions): InfiniteScrollResult<T> {
    const {hasMore, rootMargin = '200px', disabled = false} = options;
    const isSupported = !isBrowser || typeof IntersectionObserver !== 'undefined';
    const [node, setNode] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown>(undefined);
    // Bumped after each successful load so the observer re-checks the sentinel against the new layout.
    const [generation, setGeneration] = useState(0);

    const loadMoreRef = useLatest(options.loadMore);
    const loadingRef = useRef(false);
    const failedRef = useRef(false);
    const isMounted = useIsMounted();

    const load = useCallback(() => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        failedRef.current = false;
        setIsLoading(true);
        setError(undefined);

        Promise.resolve()
            .then(() => loadMoreRef.current())
            .then(
                () => {
                    loadingRef.current = false;
                    if (!isMounted()) return;
                    setIsLoading(false);
                    setGeneration((value) => value + 1);
                },
                (reason: unknown) => {
                    loadingRef.current = false;
                    failedRef.current = true;
                    if (!isMounted()) return;
                    setIsLoading(false);
                    setError(reason);
                }
            );
    }, [isMounted, loadMoreRef]);

    const rootOption = options.root;

    useEffect(() => {
        if (!node || !hasMore || disabled || typeof IntersectionObserver === 'undefined') return;
        // Resolved here, after commit, so a ref to the scroll container is already attached.
        const root = resolveRoot(rootOption);

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.some((entry) => entry.isIntersecting);
                if (visible && !loadingRef.current && !failedRef.current) load();
            },
            {root, rootMargin}
        );
        observer.observe(node);

        return () => observer.disconnect();
    }, [node, rootOption, rootMargin, hasMore, disabled, generation, load]);

    const retry = useCallback(() => {
        failedRef.current = false;
        load();
    }, [load]);

    const sentinelRef = useCallback((element: T | null) => setNode(element), []);

    return {sentinelRef, isLoading, error, retry, isSupported};
}
