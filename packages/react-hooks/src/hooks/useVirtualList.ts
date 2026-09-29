import {CSSProperties, UIEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';
import {useLatest} from './useLatest';

/** A fixed row height, or a function returning the height of the row at `index`. */
export type VirtualListItemHeight = number | ((index: number) => number);

export type VirtualListAlign = 'start' | 'center' | 'end' | 'auto';

export interface VirtualListOptions {
    /** Row height in pixels. Memoize a function with `useCallback`; a new function re-measures every row. */
    itemHeight: VirtualListItemHeight;
    /** Extra rows rendered above and below the viewport. Defaults to 4. */
    overscan?: number;
    /** Viewport height in pixels. When omitted, the container is measured with `ResizeObserver`. */
    containerHeight?: number;
}

export interface VirtualListItem<T> {
    index: number;
    item: T;
    /** Offset from the top of the list, in pixels. */
    start: number;
    /** Row height, in pixels. */
    size: number;
}

export interface VirtualListResult<T> {
    /** Spread on the scrolling container. */
    containerProps: {
        ref: (node: HTMLElement | null) => void;
        onScroll: (event: UIEvent<HTMLElement>) => void;
        style: CSSProperties;
    };
    /** Spread on the direct child of the container. It takes the full list height. */
    innerProps: {style: CSSProperties};
    /** Rows to render. Position each one absolutely at `start`. */
    virtualItems: VirtualListItem<T>[];
    totalHeight: number;
    scrollToIndex: (index: number, align?: VirtualListAlign) => void;
}

interface Metrics {
    count: number;
    total: number;
    offset: (index: number) => number;
    size: (index: number) => number;
    indexAt: (y: number) => number;
}

type Range = readonly [number, number];

function createMetrics(count: number, itemHeight: VirtualListItemHeight): Metrics {
    if (typeof itemHeight === 'number') {
        const height = Math.max(0, itemHeight);
        return {
            count,
            total: count * height,
            offset: (index) => index * height,
            size: () => height,
            indexAt: (y) => (height > 0 ? Math.min(count - 1, Math.max(0, Math.floor(y / height))) : 0),
        };
    }

    // Prefix sums: offsets[i] is the top of row i, offsets[count] is the total height.
    const offsets = new Float64Array(count + 1);
    for (let i = 0; i < count; i++) {
        offsets[i + 1] = offsets[i] + Math.max(0, itemHeight(i) || 0);
    }

    return {
        count,
        total: offsets[count],
        offset: (index) => offsets[index],
        size: (index) => offsets[index + 1] - offsets[index],
        indexAt: (y) => {
            let low = 0;
            let high = count - 1;
            while (low < high) {
                const mid = (low + high + 1) >> 1;
                if (offsets[mid] <= y) low = mid;
                else high = mid - 1;
            }
            return low;
        },
    };
}

function computeRange(metrics: Metrics, scrollTop: number, viewport: number, overscan: number): Range {
    if (metrics.count === 0) return [0, -1];
    const first = metrics.indexAt(Math.max(0, scrollTop));
    const last = metrics.indexAt(Math.max(0, scrollTop + viewport));
    const extra = Math.max(0, Math.floor(overscan));
    return [Math.max(0, first - extra), Math.min(metrics.count - 1, last + extra)];
}

/**
 * Render only the rows of a long list that are in view, with fixed or variable row heights.
 * @example
 * const list = useVirtualList(rows, {itemHeight: 32, containerHeight: 400});
 * <div {...list.containerProps}><div {...list.innerProps}>
 *     {list.virtualItems.map((row) => <Row key={row.index} top={row.start} data={row.item}/>)}
 * </div></div>
 */
export function useVirtualList<T>(items: readonly T[], options: VirtualListOptions): VirtualListResult<T> {
    const {itemHeight, overscan = 4, containerHeight} = options;
    const count = items.length;
    const metrics = useMemo(() => createMetrics(count, itemHeight), [count, itemHeight]);

    const metricsRef = useLatest(metrics);
    const overscanRef = useLatest(overscan);
    const nodeRef = useRef<HTMLElement | null>(null);
    const scrollTopRef = useRef(0);
    const viewportRef = useRef(containerHeight ?? 0);
    const [node, setNode] = useState<HTMLElement | null>(null);
    const [range, setRange] = useState<Range>(() => computeRange(metrics, 0, containerHeight ?? 0, overscan));

    // State holds only the rendered range, so scrolling inside the same range does not re-render.
    const update = useCallback(() => {
        const next = computeRange(metricsRef.current, scrollTopRef.current, viewportRef.current, overscanRef.current);
        setRange((previous) => (previous[0] === next[0] && previous[1] === next[1] ? previous : next));
    }, [metricsRef, overscanRef]);

    const ref = useCallback((element: HTMLElement | null) => {
        nodeRef.current = element;
        setNode(element);
    }, []);

    const onScroll = useCallback((event: UIEvent<HTMLElement>) => {
        scrollTopRef.current = event.currentTarget.scrollTop;
        update();
    }, [update]);

    useIsomorphicLayoutEffect(() => {
        if (containerHeight !== undefined) viewportRef.current = containerHeight;
        update();
    }, [metrics, overscan, containerHeight, update]);

    useEffect(() => {
        if (!node) return;
        scrollTopRef.current = node.scrollTop;
        if (containerHeight !== undefined) {
            update();
            return;
        }

        viewportRef.current = node.clientHeight;
        update();
        if (typeof ResizeObserver === 'undefined') return;

        const observer = new ResizeObserver(() => {
            if (node.clientHeight === viewportRef.current) return;
            viewportRef.current = node.clientHeight;
            update();
        });
        observer.observe(node);
        return () => observer.disconnect();
    }, [node, containerHeight, update]);

    const scrollToIndex = useCallback((index: number, align: VirtualListAlign = 'auto') => {
        const element = nodeRef.current;
        const current = metricsRef.current;
        if (!element || current.count === 0) return;

        const target = Math.min(current.count - 1, Math.max(0, Math.floor(index)));
        const start = current.offset(target);
        const size = current.size(target);
        const view = viewportRef.current || element.clientHeight;
        const scrollTop = element.scrollTop;

        let top: number;
        if (align === 'start') top = start;
        else if (align === 'end') top = start + size - view;
        else if (align === 'center') top = start + size / 2 - view / 2;
        else if (start < scrollTop) top = start;
        else if (start + size > scrollTop + view) top = start + size - view;
        else return;

        const clamped = Math.max(0, Math.min(top, current.total - view));
        element.scrollTop = clamped;
        // Render the destination rows now instead of waiting for the scroll event.
        scrollTopRef.current = clamped;
        update();
    }, [metricsRef, update]);

    const virtualItems = useMemo(() => {
        const result: VirtualListItem<T>[] = [];
        const end = Math.min(range[1], metrics.count - 1);
        for (let index = range[0]; index <= end; index++) {
            result.push({index, item: items[index], start: metrics.offset(index), size: metrics.size(index)});
        }
        return result;
    }, [range, metrics, items]);

    const containerStyle = useMemo<CSSProperties>(() => ({
        position: 'relative',
        overflowY: 'auto',
        overflowAnchor: 'none',
        height: containerHeight,
    }), [containerHeight]);

    const innerStyle = useMemo<CSSProperties>(() => ({
        position: 'relative',
        width: '100%',
        height: metrics.total,
    }), [metrics.total]);

    return {
        containerProps: {ref, onScroll, style: containerStyle},
        innerProps: {style: innerStyle},
        virtualItems,
        totalHeight: metrics.total,
        scrollToIndex,
    };
}
