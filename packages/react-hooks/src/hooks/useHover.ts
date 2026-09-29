import {useEffect, useMemo, useRef, useState} from 'react';
import type {HoverRef, HoverResult} from '../types';

/**
 * Track whether the pointer is over an element. Attach the returned `ref` with `ref={ref}`.
 * The ref is a callback ref, so it also works when the element mounts later or changes.
 * @example
 * const {ref, isHovered} = useHover<HTMLDivElement>();
 * <div ref={ref}>{isHovered ? 'Hovering' : 'Hover me'}</div>
 */
export function useHover<T extends HTMLElement = HTMLElement>(): HoverResult<T> {
    const [isHovered, setIsHovered] = useState(false);
    const [node, setNode] = useState<T | null>(null);
    const nodeRef = useRef<T | null>(null);

    const ref = useMemo(() => {
        const callback = (element: T | null) => {
            nodeRef.current = element;
            setNode(element);
        };
        // Expose `current` so code that reads `ref.current` keeps working.
        Object.defineProperty(callback, 'current', {
            get: () => nodeRef.current,
            enumerable: true,
        });
        return callback as HoverRef<T>;
    }, []);

    useEffect(() => {
        if (!node) return;

        const handleMouseEnter = () => setIsHovered(true);
        const handleMouseLeave = () => setIsHovered(false);

        node.addEventListener('mouseenter', handleMouseEnter);
        node.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            node.removeEventListener('mouseenter', handleMouseEnter);
            node.removeEventListener('mouseleave', handleMouseLeave);
            setIsHovered(false);
        };
    }, [node]);

    return {ref, isHovered};
}
