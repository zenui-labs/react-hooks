import {RefObject, useCallback, useEffect, useState} from 'react';
import {useLatest} from './useLatest';

/** A ref or CSS selector for the element to focus on activation, or `false` to focus the container. */
export type FocusTrapInitialFocus = RefObject<HTMLElement | null> | string | false;

export interface FocusTrapOptions {
    /** Element to focus when the trap activates. Defaults to the first tabbable element. */
    initialFocus?: FocusTrapInitialFocus;
    /** Move focus back to the previously focused element on deactivation. Defaults to true. */
    returnFocus?: boolean;
    /** Release the trap when Escape is pressed, before `active` turns false. Defaults to false. */
    escapeDeactivates?: boolean;
    /** Called when Escape is pressed while the trap is active. Set `active` to false here. */
    onEscape?: (event: KeyboardEvent) => void;
}

const TABBABLE_SELECTOR = [
    'a[href]',
    'area[href]',
    'button',
    'input',
    'select',
    'textarea',
    'iframe',
    'audio[controls]',
    'video[controls]',
    'summary',
    '[contenteditable]',
    '[tabindex]',
].join(',');

// Active traps, innermost last. Only the innermost trap handles keys and focus.
const trapStack: object[] = [];

function isVisible(element: HTMLElement) {
    if (!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)) return false;
    return window.getComputedStyle(element).visibility !== 'hidden';
}

function getTabbables(container: HTMLElement): HTMLElement[] {
    const candidates = Array.from(container.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)).filter((element) => {
        if (element.tabIndex < 0 || element.matches(':disabled')) return false;
        if (element instanceof HTMLInputElement && element.type === 'hidden') return false;
        if (element.closest('[inert]')) return false;
        return isVisible(element);
    });

    // A radio group is one tab stop: the checked radio, or the first one when none is checked.
    const radioStops = new Map<string, HTMLInputElement>();
    for (const element of candidates) {
        if (!(element instanceof HTMLInputElement) || element.type !== 'radio' || !element.name) continue;
        const stop = radioStops.get(element.name);
        if (!stop || (!stop.checked && element.checked)) radioStops.set(element.name, element);
    }
    const tabbables = candidates.filter((element) =>
        !(element instanceof HTMLInputElement && element.type === 'radio' && element.name)
        || radioStops.get(element.name) === element
    );

    // Positive tabindex values come first, in ascending order; the rest keep document order.
    const positive = tabbables.filter((element) => element.tabIndex > 0).sort((a, b) => a.tabIndex - b.tabIndex);
    return positive.concat(tabbables.filter((element) => element.tabIndex === 0));
}

/**
 * Keep keyboard focus inside a container while `active` is true, for dialogs, drawers and menus.
 * Returns a callback ref. Focus returns to the previously focused element on deactivation.
 * @example
 * const trapRef = useFocusTrap<HTMLDivElement>(open, {onEscape: () => setOpen(false)});
 * return open ? <div ref={trapRef} role="dialog" aria-modal="true">...</div> : null;
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(
    active: boolean,
    options: FocusTrapOptions = {}
): (node: T | null) => void {
    const [node, setNode] = useState<T | null>(null);
    const optionsRef = useLatest(options);

    const ref = useCallback((element: T | null) => setNode(element), []);

    useEffect(() => {
        if (!active || !node) return;

        const container: HTMLElement = node;
        const token = {};
        const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        let lastFocused: HTMLElement | null = null;
        let addedTabIndex = false;
        let released = false;

        trapStack.push(token);
        const isInnermost = () => trapStack[trapStack.length - 1] === token;

        const focusContainer = () => {
            if (!container.hasAttribute('tabindex')) {
                container.setAttribute('tabindex', '-1');
                addedTabIndex = true;
            }
            container.focus();
        };

        const onFocusIn = (event: FocusEvent) => {
            if (!isInnermost()) return;
            const target = event.target;
            if (target instanceof HTMLElement && container.contains(target)) {
                lastFocused = target;
                return;
            }
            // Focus escaped (a click or a script); pull it back.
            const fallback = lastFocused && container.contains(lastFocused) ? lastFocused : getTabbables(container)[0];
            if (fallback) fallback.focus();
            else focusContainer();
        };

        const release = () => {
            if (released) return;
            released = true;
            document.removeEventListener('keydown', onKeyDown, true);
            document.removeEventListener('focusin', onFocusIn, true);
            const index = trapStack.indexOf(token);
            if (index !== -1) trapStack.splice(index, 1);
            if (addedTabIndex) container.removeAttribute('tabindex');

            // Only restore focus if it is still inside the trap, or was lost when the trap unmounted.
            const current = document.activeElement;
            const focusIsOurs = !current || current === document.body || container.contains(current);
            if (optionsRef.current.returnFocus !== false && focusIsOurs && previous && previous.isConnected) {
                previous.focus();
            }
        };

        function onKeyDown(event: KeyboardEvent) {
            if (!isInnermost() || event.defaultPrevented) return;

            if (event.key === 'Escape') {
                const {onEscape, escapeDeactivates} = optionsRef.current;
                onEscape?.(event);
                if (escapeDeactivates) release();
                return;
            }

            if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) return;

            // Move focus ourselves so the order is exact, even with positive tabindex elsewhere on the page.
            event.preventDefault();
            const tabbables = getTabbables(container);
            if (tabbables.length === 0) {
                focusContainer();
                return;
            }
            const current = document.activeElement as HTMLElement | null;
            const index = current ? tabbables.indexOf(current) : -1;
            const last = tabbables.length - 1;
            const next = event.shiftKey
                ? (index <= 0 ? last : index - 1)
                : (index === -1 || index === last ? 0 : index + 1);
            tabbables[next].focus();
        }

        document.addEventListener('keydown', onKeyDown, true);
        document.addEventListener('focusin', onFocusIn, true);

        if (!container.contains(document.activeElement)) {
            const {initialFocus} = optionsRef.current;
            let target: HTMLElement | null = null;
            if (typeof initialFocus === 'string') target = container.querySelector<HTMLElement>(initialFocus);
            else if (initialFocus) target = initialFocus.current;
            if (!target && initialFocus !== false) target = getTabbables(container)[0] ?? null;
            if (target) target.focus();
            else focusContainer();
        } else {
            lastFocused = document.activeElement as HTMLElement;
        }

        return release;
    }, [active, node, optionsRef]);

    return ref;
}
