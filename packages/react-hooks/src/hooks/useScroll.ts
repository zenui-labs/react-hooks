import {RefObject, useEffect, useRef, useState} from 'react';
import type {ScrollData} from '../types';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

/**
 * Track the scroll position and last scroll direction of an element, or of the window
 * when no ref is given. Returns zeros on the server and reads the real position after mount.
 * @example
 * const {y, direction} = useScroll();
 * const hideHeader = direction === 'down' && y > 80;
 */
export function useScroll<T extends HTMLElement = HTMLElement>(ref?: RefObject<T | null>): ScrollData {
    const [scroll, setScroll] = useState<ScrollData>({x: 0, y: 0, direction: null});
    const [target, setTarget] = useState<T | Window | null>(null);
    // Last seen position. Lives outside the effect so re-subscribing keeps it.
    const last = useRef<{x: number; y: number} | null>(null);

    // Resolve the target after every commit so a ref that attaches later is picked up.
    useIsomorphicLayoutEffect(() => {
        const next = ref ? ref.current : window;
        setTarget(prev => (prev === next ? prev : next));
    });

    useEffect(() => {
        if (!target) return;

        const read = () => (target === window
            ? {x: window.scrollX, y: window.scrollY}
            : {x: (target as T).scrollLeft, y: (target as T).scrollTop});

        const initial = read();
        last.current = initial;
        setScroll(prev => (prev.x === initial.x && prev.y === initial.y ? prev : {...initial, direction: prev.direction}));

        const handleScroll = () => {
            const {x, y} = read();
            const prev = last.current ?? {x, y};

            let direction: ScrollData['direction'] = null;
            if (y > prev.y) direction = 'down';
            else if (y < prev.y) direction = 'up';
            else if (x > prev.x) direction = 'right';
            else if (x < prev.x) direction = 'left';

            last.current = {x, y};
            setScroll({x, y, direction});
        };

        target.addEventListener('scroll', handleScroll, {passive: true});

        return () => {
            target.removeEventListener('scroll', handleScroll);
        };
    }, [target]);

    return scroll;
}
