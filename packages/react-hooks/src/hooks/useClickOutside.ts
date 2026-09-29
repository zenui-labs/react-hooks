import {RefObject, useEffect} from 'react';
import {useLatest} from './useLatest';

/**
 * Call `handler` when a pointer press starts outside the element in `ref`.
 * Uses `pointerdown` where available, and falls back to `mousedown` plus `touchstart`
 * without firing twice for one touch.
 * @example
 * const panelRef = useRef<HTMLDivElement>(null);
 * useClickOutside(panelRef, () => setOpen(false));
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T | null>,
    handler: (event: MouseEvent | TouchEvent) => void
): void {
    const handlerRef = useLatest(handler);

    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const element = ref.current;
            if (!element) return;
            // composedPath is captured at dispatch, so it still works if the target
            // was removed from the DOM by an earlier handler, and it crosses shadow roots.
            const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
            if (path.includes(element) || element.contains(event.target as Node)) return;
            handlerRef.current(event);
        };

        if ('PointerEvent' in window) {
            document.addEventListener('pointerdown', listener);
            return () => document.removeEventListener('pointerdown', listener);
        }

        // Legacy browsers: a touch also emits a compatibility mousedown. Ignore it.
        let lastTouch = 0;
        const onTouchStart = (event: TouchEvent) => {
            lastTouch = Date.now();
            listener(event);
        };
        const onMouseDown = (event: MouseEvent) => {
            if (Date.now() - lastTouch < 800) return;
            listener(event);
        };

        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('touchstart', onTouchStart, {passive: true});

        return () => {
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('touchstart', onTouchStart);
        };
    }, [ref, handlerRef]);
}
