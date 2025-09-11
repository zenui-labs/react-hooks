import {RefObject, useEffect, useState} from 'react';
import {ScrollData} from "../types";

export function useScroll<T extends HTMLElement = HTMLElement>(
    ref?: RefObject<T>
) {
    const [scroll, setScroll] = useState<ScrollData>({
        x: 0,
        y: 0,
        direction: null,
    });

    useEffect(() => {
        const target = ref?.current || window;
        let lastX = 0;
        let lastY = 0;

        const handleScroll = () => {
            const x = ref?.current ? ref.current.scrollLeft : window.scrollX;
            const y = ref?.current ? ref.current.scrollTop : window.scrollY;

            let direction: ScrollData['direction'] = null;
            if (y > lastY) direction = 'down';
            else if (y < lastY) direction = 'up';
            else if (x > lastX) direction = 'right';
            else if (x < lastX) direction = 'left';

            setScroll({x, y, direction});

            lastX = x;
            lastY = y;
        };

        target.addEventListener('scroll', handleScroll, {passive: true});

        return () => {
            target.removeEventListener('scroll', handleScroll);
        };
    }, [ref]);

    return scroll;
}
