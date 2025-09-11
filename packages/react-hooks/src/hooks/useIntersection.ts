import {RefObject, useEffect, useRef, useState} from 'react';

interface IntersectionOptions extends IntersectionObserverInit {
}

export function useIntersection<T extends HTMLElement = HTMLElement>(
    options: IntersectionOptions = {}
) {
    const ref = useRef<T>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsIntersecting(entry.isIntersecting),
            options
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, [options]);

    return {ref, isIntersecting} as { ref: RefObject<T>; isIntersecting: boolean };
}
