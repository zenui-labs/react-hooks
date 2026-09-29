import {useEffect, useMemo, useRef} from 'react';
import type {LongPressHandlers, LongPressOptions} from '../types';
import {useLatest} from './useLatest';

/** Mouse events that follow a touch within this window are emulated. Ignore them. */
const EMULATED_MOUSE_WINDOW = 1000;

/**
 * Call `callback` when an element is pressed and held for `delay` milliseconds.
 * Spread the returned handlers onto the element. Works with mouse and touch, and
 * suppresses the context menu that a touch long press would open.
 * @example
 * const bind = useLongPress(() => setMenuOpen(true), {delay: 600});
 * <button {...bind}>Hold for options</button>
 */
export function useLongPress(
    callback: () => void,
    options: LongPressOptions = {}
): LongPressHandlers {
    const callbackRef = useLatest(callback);
    const optionsRef = useLatest(options);
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const triggered = useRef(false);
    const pressing = useRef(false);
    const lastTouch = useRef(0);
    const touching = useRef(false);

    const handlers = useMemo<LongPressHandlers>(() => {
        const start = () => {
            if (pressing.current) return;
            pressing.current = true;
            triggered.current = false;
            optionsRef.current.onStart?.();
            timeout.current = setTimeout(() => {
                timeout.current = null;
                triggered.current = true;
                callbackRef.current();
            }, optionsRef.current.delay ?? 500);
        };

        const clear = () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
                timeout.current = null;
            }
            pressing.current = false;
            if (triggered.current) {
                triggered.current = false;
                optionsRef.current.onEnd?.();
            }
        };

        const isEmulated = () => Date.now() - lastTouch.current < EMULATED_MOUSE_WINDOW;

        return {
            onMouseDown: (event) => {
                if (isEmulated() || (event && event.button !== 0)) return;
                start();
            },
            onMouseUp: () => {
                if (!isEmulated()) clear();
            },
            onMouseLeave: () => {
                if (!isEmulated()) clear();
            },
            onTouchStart: () => {
                touching.current = true;
                lastTouch.current = Date.now();
                start();
            },
            onTouchEnd: () => {
                touching.current = false;
                lastTouch.current = Date.now();
                clear();
            },
            onTouchCancel: () => {
                touching.current = false;
                clear();
            },
            onContextMenu: (event) => {
                // Touch browsers open a context menu on long press. Keep it closed during a touch press.
                if (event && touching.current) event.preventDefault();
            },
        };
    }, [callbackRef, optionsRef]);

    // Only cancel a pending timer on unmount. Do not call onEnd for a component that is gone.
    useEffect(() => () => {
        if (timeout.current) clearTimeout(timeout.current);
    }, []);

    return handlers;
}
