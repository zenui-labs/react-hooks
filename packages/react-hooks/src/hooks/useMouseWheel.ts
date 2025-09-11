import {RefObject, useEffect, useState} from 'react';
import {MouseWheelEvent} from "../types";

export function useMouseWheel<T extends HTMLElement = HTMLElement>(
    ref?: RefObject<T>
) {
    const [wheelData, setWheelData] = useState<MouseWheelEvent>({
        deltaX: 0,
        deltaY: 0,
        deltaZ: 0,
    });

    useEffect(() => {
        const target: EventTarget = ref?.current || window;

        const handleWheel = (event: Event) => {
            const e = event as WheelEvent;
            setWheelData({
                deltaX: e.deltaX,
                deltaY: e.deltaY,
                deltaZ: e.deltaZ,
            });
        };

        target.addEventListener('wheel', handleWheel, {passive: true});

        return () => {
            target.removeEventListener('wheel', handleWheel);
        };
    }, [ref]);

    return wheelData;
}
