import {RefObject, useEffect, useState} from 'react';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

/** The scrolling container: a ref or an element. Omit it to use the viewport. */
export type ScrollSpyRoot = RefObject<Element | null> | Element | null;

export interface ScrollSpyOptions {
    /** Scrolling container that holds the sections. Defaults to the viewport. */
    root?: ScrollSpyRoot;
    /** IntersectionObserver root margin. Overrides the margin derived from `offset`. */
    rootMargin?: string;
    /** Pixels at the top of the root to ignore, for example a sticky header. Defaults to 0. */
    offset?: number;
}

function resolveRoot(root: ScrollSpyRoot | undefined): Element | null {
    if (!root) return null;
    if ('current' in root) return root.current ?? null;
    return root;
}

/**
 * Return the id of the section currently in view, for a table of contents or a sticky nav.
 * Picks the topmost visible section, and the last one once the container is scrolled to the end.
 * @example
 * const active = useScrollSpy(['intro', 'install', 'usage'], {offset: 64});
 * return <a href="#usage" aria-current={active === 'usage' ? 'location' : undefined}>Usage</a>;
 */
export function useScrollSpy(ids: string[], options: ScrollSpyOptions = {}): string | null {
    const {root, rootMargin, offset = 0} = options;
    const hasRoot = root !== undefined && root !== null;
    const idsKey = ids.join('\n');
    const [activeId, setActiveId] = useState<string | null>(null);
    const [rootElement, setRootElement] = useState<Element | null>(null);

    // Refs do not trigger renders, so re-resolve the root after every commit.
    useIsomorphicLayoutEffect(() => {
        setRootElement(resolveRoot(root));
    });

    useEffect(() => {
        if (typeof IntersectionObserver === 'undefined') return;
        if (hasRoot && !rootElement) return;

        const elements = (idsKey ? idsKey.split('\n') : [])
            .map((id) => document.getElementById(id))
            .filter((element): element is HTMLElement => element !== null);
        if (elements.length === 0) return;

        const visible = new Set<Element>();
        let frame = 0;

        const isAtEnd = () => {
            if (rootElement) {
                const scrollable = rootElement.scrollHeight > rootElement.clientHeight;
                return scrollable && rootElement.scrollTop + rootElement.clientHeight >= rootElement.scrollHeight - 2;
            }
            const doc = document.documentElement;
            const scrollable = doc.scrollHeight > window.innerHeight;
            return scrollable && window.scrollY + window.innerHeight >= doc.scrollHeight - 2;
        };

        const pick = () => {
            frame = 0;
            const candidates = elements.filter((element) => visible.has(element));
            // Between sections, keep the previous answer.
            if (candidates.length === 0) return;

            const tops = candidates.map((element) => ({id: element.id, top: element.getBoundingClientRect().top}));
            const end = isAtEnd();
            const chosen = tops.reduce((best, entry) => (end ? entry.top > best.top : entry.top < best.top) ? entry : best);
            setActiveId(chosen.id);
        };

        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(pick);
        };

        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) visible.add(entry.target);
                else visible.delete(entry.target);
            }
            schedule();
        }, {
            root: rootElement,
            rootMargin: rootMargin ?? `${-Math.max(0, offset)}px 0px 0px 0px`,
            threshold: 0,
        });

        elements.forEach((element) => observer.observe(element));

        // Scrolling only matters for the end-of-container rule; visibility comes from the observer.
        const scrollTarget: EventTarget = rootElement ?? window;
        scrollTarget.addEventListener('scroll', schedule, {passive: true});

        return () => {
            observer.disconnect();
            scrollTarget.removeEventListener('scroll', schedule);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [idsKey, hasRoot, rootElement, rootMargin, offset]);

    return activeId;
}
