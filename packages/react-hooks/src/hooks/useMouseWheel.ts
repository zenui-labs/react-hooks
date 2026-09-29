import {RefObject, useEffect, useState} from 'react';
import {MouseWheelEvent} from '../types';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

/**
 * Report the deltas of the most recent wheel event, on the window or on the element in `ref`.
 * The listener is passive, so it never blocks scrolling.
 * @example
 * const {deltaY} = useMouseWheel();
 * const zoom = deltaY < 0 ? 'in' : 'out';
 */
export function useMouseWheel<T extends HTMLElement = HTMLElement>(
    ref?: RefObject<T | null>
) {
    const [wheelData, setWheelData] = useState<MouseWheelEvent>({
        deltaX: 0,
        deltaY: 0,
        deltaZ: 0,
    });
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

        const handleWheel = (event: Event) => {
            const {deltaX, deltaY, deltaZ} = event as WheelEvent;
            setWheelData({deltaX, deltaY, deltaZ});
        };

        target.addEventListener('wheel', handleWheel, {passive: true});

        return () => target.removeEventListener('wheel', handleWheel);
    }, [node, hasRef]);

    return wheelData;
}
