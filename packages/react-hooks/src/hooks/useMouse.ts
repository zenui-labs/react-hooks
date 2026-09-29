import {RefObject, useEffect, useState} from 'react';
import {MousePosition} from '../types';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

/**
 * Track the pointer position. Without a ref it reports viewport coordinates from anywhere on the page.
 * With a ref it reports coordinates relative to that element while the pointer is over it.
 * Updates are batched to one per animation frame.
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * const {x, y} = useMouse(ref);
 */
export function useMouse<T extends HTMLElement = HTMLElement>(ref?: RefObject<T | null>) {
    const [position, setPosition] = useState<MousePosition>({x: 0, y: 0});
    const [node, setNode] = useState<T | null>(null);

    // Re-read the ref after every commit so an element that mounts later is still tracked.
    useIsomorphicLayoutEffect(() => {
        const current = ref?.current ?? null;
        if (current !== node) setNode(current);
    });

    const hasRef = !!ref;

    useEffect(() => {
        if (hasRef && !node) return;

        const target: EventTarget = node ?? window;
        let frame = 0;
        let lastEvent: MouseEvent | null = null;

        const flush = () => {
            frame = 0;
            const event = lastEvent;
            if (!event) return;

            let x = event.clientX;
            let y = event.clientY;
            if (node) {
                const rect = node.getBoundingClientRect();
                x -= rect.left;
                y -= rect.top;
            }

            setPosition(prev => (prev.x === x && prev.y === y ? prev : {x, y}));
        };

        const handleMouseMove = (event: Event) => {
            lastEvent = event as MouseEvent;
            if (!frame) frame = requestAnimationFrame(flush);
        };

        target.addEventListener('mousemove', handleMouseMove, {passive: true});

        return () => {
            if (frame) cancelAnimationFrame(frame);
            target.removeEventListener('mousemove', handleMouseMove);
        };
    }, [node, hasRef]);

    return position;
}
