import {RefObject, useEffect, useState} from 'react';
import {MousePosition} from "../types";


export function useMouse<T extends HTMLElement = HTMLElement>(ref?: RefObject<T>) {
    const [position, setPosition] = useState<MousePosition>({x: 0, y: 0});

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (ref?.current) {
                const rect = ref.current.getBoundingClientRect();
                setPosition({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                });
            } else {
                setPosition({
                    x: event.clientX,
                    y: event.clientY,
                });
            }
        };

        const target = ref?.current || window;
        target.addEventListener('mousemove', handleMouseMove as EventListener);

        return () => {
            target.removeEventListener('mousemove', handleMouseMove as EventListener);
        };
    }, [ref]);

    return position;
}
