import {useCallback, useEffect, useRef, useState} from 'react';
import {useLatest} from './useLatest';

export type DraggableAxis = 'x' | 'y' | 'both';

export interface DraggablePosition {
    x: number;
    y: number;
}

/** Limits for the translated position, in pixels. Omitted sides are unbounded. */
export interface DraggableBoundsRect {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
}

export type DraggableBounds = 'parent' | DraggableBoundsRect;

export type DraggableEvent = PointerEvent | KeyboardEvent;

export interface DraggableOptions {
    /** Axis the element may move along. Defaults to `'both'`. */
    axis?: DraggableAxis;
    /** Keep the element inside its parent, or inside fixed limits for the position. */
    bounds?: DraggableBounds;
    /** Snap the position to multiples of `[x, y]` pixels. */
    grid?: [number, number];
    /** Starting position. Read once on mount and used by `reset`. */
    initial?: DraggablePosition;
    /** Ignore pointer and keyboard input while true. */
    disabled?: boolean;
    /** CSS selector. When set, a drag only starts from a matching descendant. */
    handle?: string;
    onDragStart?: (position: DraggablePosition, event: PointerEvent) => void;
    onDrag?: (position: DraggablePosition, event: DraggableEvent) => void;
    onDragEnd?: (position: DraggablePosition, event: DraggableEvent) => void;
}

export interface DraggableResult<T extends HTMLElement> {
    /** Callback ref for the draggable element. */
    ref: (node: T | null) => void;
    /** Translation from the element's layout position. Apply it with a CSS transform. */
    position: DraggablePosition;
    isDragging: boolean;
    setPosition: (next: DraggablePosition | ((previous: DraggablePosition) => DraggablePosition)) => void;
    reset: () => void;
}

interface Limits {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}

const UNBOUNDED: Limits = {minX: -Infinity, maxX: Infinity, minY: -Infinity, maxY: Infinity};
const KEY_STEP = 10;

// `rendered` must be the position the DOM currently shows, so the rects and the position agree.
function getLimits(node: HTMLElement, bounds: DraggableBounds | undefined, rendered: DraggablePosition): Limits {
    if (!bounds) return UNBOUNDED;

    if (bounds === 'parent') {
        const parent = node.parentElement;
        if (!parent) return UNBOUNDED;
        const outer = parent.getBoundingClientRect();
        const rect = node.getBoundingClientRect();
        const left = outer.left + parent.clientLeft;
        const top = outer.top + parent.clientTop;
        return {
            minX: rendered.x + left - rect.left,
            maxX: rendered.x + left + parent.clientWidth - rect.right,
            minY: rendered.y + top - rect.top,
            maxY: rendered.y + top + parent.clientHeight - rect.bottom,
        };
    }

    return rectLimits(bounds);
}

function rectLimits(bounds: DraggableBoundsRect): Limits {
    return {
        minX: bounds.left ?? -Infinity,
        maxX: bounds.right ?? Infinity,
        minY: bounds.top ?? -Infinity,
        maxY: bounds.bottom ?? Infinity,
    };
}

function snap(value: number, step: number | undefined) {
    return step && step > 0 ? Math.round(value / step) * step : value;
}

// Clamp to the nearest grid line that still fits inside the limits.
function clampAxis(value: number, min: number, max: number, step: number | undefined) {
    if (step && step > 0) {
        const low = Math.ceil(min / step) * step;
        const high = Math.floor(max / step) * step;
        if (low <= high) return Math.min(high, Math.max(low, value));
    }
    return Math.min(max, Math.max(min, value));
}

function constrain(
    raw: DraggablePosition,
    limits: Limits,
    grid: [number, number] | undefined,
    axis: DraggableAxis,
    anchor: DraggablePosition
): DraggablePosition {
    const x = axis === 'y' ? anchor.x : clampAxis(snap(raw.x, grid?.[0]), limits.minX, limits.maxX, grid?.[0]);
    const y = axis === 'x' ? anchor.y : clampAxis(snap(raw.y, grid?.[1]), limits.minY, limits.maxY, grid?.[1]);
    // `+ 0` turns -0 into 0 so readouts never show "-0".
    return {x: x + 0, y: y + 0};
}

/**
 * Drag an element with mouse, touch or pen, with optional axis lock, bounds and grid snapping.
 * Arrow keys move the focused element by one grid step, or 10px without a grid.
 * @example
 * const {ref, position} = useDraggable<HTMLDivElement>({bounds: 'parent', grid: [20, 20]});
 * return <div ref={ref} style={{transform: `translate(${position.x}px, ${position.y}px)`}}>Drag me</div>;
 */
export function useDraggable<T extends HTMLElement = HTMLElement>(options: DraggableOptions = {}): DraggableResult<T> {
    const optionsRef = useLatest(options);
    const initialRef = useRef<DraggablePosition>(options.initial ?? {x: 0, y: 0});
    const nodeRef = useRef<T | null>(null);
    const [node, setNode] = useState<T | null>(null);
    const [position, setPositionState] = useState<DraggablePosition>(initialRef.current);
    const [isDragging, setIsDragging] = useState(false);

    // Latest intended position, updated synchronously between renders.
    const positionRef = useRef(position);
    // Position as last committed to the DOM.
    const renderedRef = useLatest(position);

    const ref = useCallback((element: T | null) => {
        nodeRef.current = element;
        setNode(element);
    }, []);

    const commit = useCallback((next: DraggablePosition) => {
        positionRef.current = next;
        setPositionState(next);
    }, []);

    useEffect(() => {
        if (!node) return;
        const element = node;

        // Pointer events on touch screens need touch-action: none, or the browser scrolls instead.
        const previousTouchAction = element.style.touchAction;
        element.style.touchAction = 'none';

        // Keyboard support needs the element to be focusable.
        const addedTabIndex = !element.hasAttribute('tabindex') && element.tabIndex < 0;
        if (addedTabIndex) element.tabIndex = 0;

        let pointerId: number | null = null;
        let startX = 0;
        let startY = 0;
        let origin: DraggablePosition = positionRef.current;
        let limits: Limits = UNBOUNDED;

        const preventDefault = (event: Event) => event.preventDefault();

        const finish = (event: PointerEvent, notify: boolean) => {
            pointerId = null;
            try {
                if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
            } catch {
                // The pointer may already be gone.
            }
            document.removeEventListener('selectstart', preventDefault);
            setIsDragging(false);
            if (notify) optionsRef.current.onDragEnd?.(positionRef.current, event);
        };

        const onPointerDown = (event: PointerEvent) => {
            const opts = optionsRef.current;
            if (opts.disabled || pointerId !== null || !event.isPrimary) return;
            if (event.pointerType === 'mouse' && event.button !== 0) return;
            if (opts.handle) {
                const target = event.target as Element | null;
                const handle = target && typeof target.closest === 'function' ? target.closest(opts.handle) : null;
                if (!handle || !element.contains(handle)) return;
            }

            pointerId = event.pointerId;
            startX = event.clientX;
            startY = event.clientY;
            origin = positionRef.current;
            limits = getLimits(element, opts.bounds, renderedRef.current);

            try {
                element.setPointerCapture(event.pointerId);
            } catch {
                // Capture can fail for synthetic events; dragging still works while the pointer stays over the element.
            }
            document.addEventListener('selectstart', preventDefault);
            setIsDragging(true);
            opts.onDragStart?.(origin, event);
        };

        const onPointerMove = (event: PointerEvent) => {
            if (event.pointerId !== pointerId) return;
            const opts = optionsRef.current;
            const next = constrain(
                {x: origin.x + event.clientX - startX, y: origin.y + event.clientY - startY},
                limits,
                opts.grid,
                opts.axis ?? 'both',
                origin
            );
            const previous = positionRef.current;
            if (next.x === previous.x && next.y === previous.y) return;
            commit(next);
            opts.onDrag?.(next, event);
        };

        const onPointerUp = (event: PointerEvent) => {
            if (event.pointerId === pointerId) finish(event, true);
        };

        const onKeyDown = (event: KeyboardEvent) => {
            const opts = optionsRef.current;
            if (opts.disabled || pointerId !== null || event.target !== element) return;
            if (event.altKey || event.ctrlKey || event.metaKey) return;

            const axis = opts.axis ?? 'both';
            const stepX = opts.grid?.[0] || KEY_STEP;
            const stepY = opts.grid?.[1] || KEY_STEP;
            let dx = 0;
            let dy = 0;
            if (event.key === 'ArrowLeft') dx = -stepX;
            else if (event.key === 'ArrowRight') dx = stepX;
            else if (event.key === 'ArrowUp') dy = -stepY;
            else if (event.key === 'ArrowDown') dy = stepY;
            if (axis === 'x') dy = 0;
            if (axis === 'y') dx = 0;
            if (!dx && !dy) return;

            event.preventDefault();
            const from = positionRef.current;
            const next = constrain(
                {x: from.x + dx, y: from.y + dy},
                getLimits(element, opts.bounds, renderedRef.current),
                opts.grid,
                axis,
                from
            );
            if (next.x === from.x && next.y === from.y) return;
            commit(next);
            opts.onDrag?.(next, event);
            opts.onDragEnd?.(next, event);
        };

        element.addEventListener('pointerdown', onPointerDown);
        element.addEventListener('pointermove', onPointerMove);
        element.addEventListener('pointerup', onPointerUp);
        element.addEventListener('pointercancel', onPointerUp);
        element.addEventListener('lostpointercapture', onPointerUp);
        element.addEventListener('keydown', onKeyDown);
        element.addEventListener('dragstart', preventDefault);

        return () => {
            element.removeEventListener('pointerdown', onPointerDown);
            element.removeEventListener('pointermove', onPointerMove);
            element.removeEventListener('pointerup', onPointerUp);
            element.removeEventListener('pointercancel', onPointerUp);
            element.removeEventListener('lostpointercapture', onPointerUp);
            element.removeEventListener('keydown', onKeyDown);
            element.removeEventListener('dragstart', preventDefault);
            document.removeEventListener('selectstart', preventDefault);
            if (pointerId !== null) {
                pointerId = null;
                setIsDragging(false);
            }
            element.style.touchAction = previousTouchAction;
            if (addedTabIndex) element.removeAttribute('tabindex');
        };
    }, [node, commit, optionsRef, renderedRef]);

    const setPosition = useCallback((next: DraggablePosition | ((previous: DraggablePosition) => DraggablePosition)) => {
        const previous = positionRef.current;
        const value = typeof next === 'function' ? next(previous) : next;
        const opts = optionsRef.current;
        const element = nodeRef.current;
        const limits = element
            ? getLimits(element, opts.bounds, renderedRef.current)
            : opts.bounds && opts.bounds !== 'parent' ? rectLimits(opts.bounds) : UNBOUNDED;
        commit(constrain(value, limits, opts.grid, 'both', previous));
    }, [commit, optionsRef, renderedRef]);

    const reset = useCallback(() => setPosition(initialRef.current), [setPosition]);

    return {ref, position, isDragging, setPosition, reset};
}
