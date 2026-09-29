import {RefObject, useEffect, useState} from 'react';
import type {EventOptions} from '../types';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';
import {useLatest} from './useLatest';

type EventTargetLike = Window | Document | HTMLElement;
type EventTargetInput = EventTargetLike | RefObject<EventTargetLike | null> | null;

function resolveTarget(target: EventTargetInput | undefined): EventTargetLike | null {
    if (target === undefined) return window;
    if (target === null) return null;
    if (typeof (target as EventTarget).addEventListener === 'function') return target as EventTargetLike;
    return (target as RefObject<EventTargetLike | null>).current;
}

/**
 * Attach an event listener to the window, the document, an element or a ref, with cleanup.
 * The listener can change on every render without re-subscribing, and a ref is re-read
 * after each render so an element that mounts later is picked up.
 * @example
 * useEvent('resize', () => setWidth(window.innerWidth));
 * useEvent('keydown', (event) => event.key === 'Escape' && close(), document);
 * useEvent('click', () => setClicks((n) => n + 1), buttonRef);
 */
export function useEvent<K extends keyof WindowEventMap>(
    type: K,
    listener: (event: WindowEventMap[K]) => void,
    target?: Window | RefObject<Window | null> | null,
    options?: EventOptions
): void;
export function useEvent<K extends keyof DocumentEventMap>(
    type: K,
    listener: (event: DocumentEventMap[K]) => void,
    target: Document | RefObject<Document | null> | null,
    options?: EventOptions
): void;
export function useEvent<K extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLElement>(
    type: K,
    listener: (event: HTMLElementEventMap[K]) => void,
    target: T | RefObject<T | null> | null,
    options?: EventOptions
): void;
export function useEvent<K extends keyof WindowEventMap, T extends HTMLElement | Window | Document = Window>(
    type: K,
    listener: (event: WindowEventMap[K]) => void,
    target?: RefObject<T | null> | T | null,
    options?: EventOptions
): void;
export function useEvent(
    type: string,
    listener: (event: Event) => void,
    target?: EventTarget | RefObject<EventTarget | null> | null,
    options?: EventOptions
): void;
export function useEvent(
    type: string,
    listener: (event: Event) => void,
    target?: EventTarget | RefObject<EventTarget | null> | null,
    options?: EventOptions
): void {
    const listenerRef = useLatest(listener);
    const [element, setElement] = useState<EventTargetLike | null>(null);

    // Resolve the target after every commit. Ref objects keep their identity, so this is
    // the only way to notice that `ref.current` now points at a different element.
    useIsomorphicLayoutEffect(() => {
        const next = resolveTarget(target as EventTargetInput | undefined);
        setElement(prev => (prev === next ? prev : next));
    });

    // Compare options by value so an inline object does not re-subscribe on every render.
    const capture = options?.capture;
    const passive = options?.passive;
    const once = options?.once;

    useEffect(() => {
        if (!element) return;

        const handler = (event: Event) => listenerRef.current(event);
        const listenerOptions: AddEventListenerOptions = {capture, passive, once};

        element.addEventListener(type, handler, listenerOptions);

        return () => {
            element.removeEventListener(type, handler, listenerOptions);
        };
    }, [element, type, capture, passive, once, listenerRef]);
}
