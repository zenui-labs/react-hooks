import {useState} from 'react';
import type {WindowSize} from '../types';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

/**
 * Track the window's inner width and height.
 * Returns `0 x 0` on the server and on the first client render so hydration matches,
 * then reads the real size in a layout effect before the browser paints.
 * @example
 * const {width} = useWindowSize();
 * const isMobile = width > 0 && width < 640;
 */
export function useWindowSize(): WindowSize {
    const [windowSize, setWindowSize] = useState<WindowSize>({width: 0, height: 0});

    useIsomorphicLayoutEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            setWindowSize(prev => (prev.width === width && prev.height === height ? prev : {width, height}));
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}
