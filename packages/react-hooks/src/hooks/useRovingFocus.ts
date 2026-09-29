import {KeyboardEvent as ReactKeyboardEvent, useCallback, useRef, useState} from 'react';
import {useLatest} from './useLatest';

export type RovingFocusOrientation = 'horizontal' | 'vertical' | 'both';

export interface RovingFocusOptions {
    /** Number of items. */
    count: number;
    /** Which arrow keys move focus. Ignored when `columns` is set. Defaults to `'vertical'`. */
    orientation?: RovingFocusOrientation;
    /** Wrap from the last item to the first and back. Defaults to true. */
    loop?: boolean;
    /** Lay items out as a grid: Left and Right move by one, Up and Down move by a row. */
    columns?: number;
    /** Index that owns the tab stop on mount. Defaults to 0. */
    initialIndex?: number;
    /** Items for which this returns true are skipped by the keyboard. */
    isDisabled?: (index: number) => boolean;
    /** Called when the active index changes. */
    onChange?: (index: number) => void;
}

export interface RovingFocusItemProps<T extends HTMLElement> {
    tabIndex: 0 | -1;
    ref: (node: T | null) => void;
    onKeyDown: (event: ReactKeyboardEvent<T>) => void;
    onFocus: () => void;
}

export interface RovingFocusResult<T extends HTMLElement> {
    /** Index of the item that owns the tab stop. */
    activeIndex: number;
    /** Move the tab stop without moving focus. */
    setActiveIndex: (index: number) => void;
    /** Move the tab stop and focus that item. */
    focusItem: (index: number) => void;
    /** Props to spread on each item. */
    getItemProps: (index: number) => RovingFocusItemProps<T>;
}

interface ItemHandlers<T extends HTMLElement> {
    ref: (node: T | null) => void;
    onKeyDown: (event: ReactKeyboardEvent<T>) => void;
    onFocus: () => void;
}

/**
 * Roving tabindex for toolbars, menus, listboxes and grids: one Tab stop, arrow keys move between items.
 * Home and End jump to the first and last item. Disabled items are skipped.
 * @example
 * const {getItemProps} = useRovingFocus({count: tools.length, orientation: 'horizontal'});
 * return <div role="toolbar">{tools.map((tool, i) => <button key={tool} {...getItemProps(i)}>{tool}</button>)}</div>;
 */
export function useRovingFocus<T extends HTMLElement = HTMLElement>(options: RovingFocusOptions): RovingFocusResult<T> {
    const {count, isDisabled} = options;
    const optionsRef = useLatest(options);
    const itemsRef = useRef<(T | null)[]>([]);
    const handlersRef = useRef(new Map<number, ItemHandlers<T>>());
    const [activeIndex, setActiveState] = useState(() => Math.max(0, options.initialIndex ?? 0));
    const activeRef = useRef(activeIndex);

    const setActiveIndex = useCallback((index: number) => {
        const total = optionsRef.current.count;
        if (total <= 0) return;
        const next = Math.min(total - 1, Math.max(0, Math.floor(index)));
        if (next === activeRef.current) return;
        activeRef.current = next;
        setActiveState(next);
        optionsRef.current.onChange?.(next);
    }, [optionsRef]);

    const focusItem = useCallback((index: number) => {
        setActiveIndex(index);
        itemsRef.current[index]?.focus();
    }, [setActiveIndex]);

    const findTarget = useCallback((from: number, key: string): { handled: boolean; index: number | null } => {
        const {count: total, orientation = 'vertical', loop = true, columns, isDisabled: disabled} = optionsRef.current;
        if (total <= 0) return {handled: false, index: null};
        const enabled = (index: number) => !disabled?.(index);
        const grid = columns && columns > 0 ? Math.floor(columns) : 0;

        if (key === 'Home' || key === 'End') {
            const forward = key === 'Home';
            for (let step = 0; step < total; step++) {
                const index = forward ? step : total - 1 - step;
                if (enabled(index)) return {handled: true, index};
            }
            return {handled: true, index: null};
        }

        let delta = 0;
        const horizontal = grid > 0 || orientation !== 'vertical';
        const vertical = grid > 0 || orientation !== 'horizontal';
        if (key === 'ArrowRight' && horizontal) delta = 1;
        else if (key === 'ArrowLeft' && horizontal) delta = -1;
        else if (key === 'ArrowDown' && vertical) delta = grid || 1;
        else if (key === 'ArrowUp' && vertical) delta = -(grid || 1);
        if (!delta) return {handled: false, index: null};

        let index = from;
        for (let attempt = 0; attempt < total; attempt++) {
            index += delta;
            if (index < 0 || index >= total) {
                if (!loop) return {handled: true, index: null};
                if (Math.abs(delta) === 1) {
                    index = (index + total) % total;
                } else {
                    // Grid rows wrap within the same column.
                    const column = ((from % grid) + grid) % grid;
                    if (index >= total) {
                        index = column;
                    } else {
                        index = Math.floor((total - 1) / grid) * grid + column;
                        if (index >= total) index -= grid;
                    }
                }
            }
            if (enabled(index)) return {handled: true, index};
        }
        return {handled: true, index: null};
    }, [optionsRef]);

    const getHandlers = useCallback((index: number): ItemHandlers<T> => {
        let handlers = handlersRef.current.get(index);
        if (!handlers) {
            handlers = {
                ref: (node) => {
                    itemsRef.current[index] = node;
                },
                onKeyDown: (event) => {
                    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
                    const {handled, index: next} = findTarget(index, event.key);
                    if (!handled) return;
                    event.preventDefault();
                    if (next !== null) focusItem(next);
                },
                onFocus: () => setActiveIndex(index),
            };
            handlersRef.current.set(index, handlers);
        }
        return handlers;
    }, [findTarget, focusItem, setActiveIndex]);

    // Keep the tab stop on a real, enabled item when the list shrinks or the active item is disabled.
    let tabStop = count > 0 ? Math.min(activeIndex, count - 1) : -1;
    if (tabStop >= 0 && isDisabled?.(tabStop)) {
        tabStop = -1;
        for (let index = 0; index < count; index++) {
            if (!isDisabled(index)) {
                tabStop = index;
                break;
            }
        }
    }

    const getItemProps = useCallback((index: number): RovingFocusItemProps<T> => ({
        tabIndex: index === tabStop ? 0 : -1,
        ...getHandlers(index),
    }), [tabStop, getHandlers]);

    return {activeIndex: Math.max(0, tabStop), setActiveIndex, focusItem, getItemProps};
}
