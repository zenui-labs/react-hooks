import {useCallback, useEffect, useRef, useState} from 'react';
import {FullscreenControls} from "../types";

export function useFullscreen<T extends HTMLElement = HTMLElement>() {
    const ref = useRef<T>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const enter = useCallback(() => {
        if (ref.current) {
            if (ref.current.requestFullscreen) {
                ref.current.requestFullscreen();
            } else if ((ref.current as any).webkitRequestFullscreen) {
                (ref.current as any).webkitRequestFullscreen();
            } else if ((ref.current as any).msRequestFullscreen) {
                (ref.current as any).msRequestFullscreen();
            }
        }
    }, []);

    const exit = useCallback(() => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }, []);

    const toggle = useCallback(() => {
        if (isFullscreen) exit();
        else enter();
    }, [isFullscreen, enter, exit]);

    const handleChange = useCallback(() => {
        setIsFullscreen(document.fullscreenElement === ref.current);
    }, []);

    useEffect(() => {
        document.addEventListener('fullscreenchange', handleChange);
        return () => document.removeEventListener('fullscreenchange', handleChange);
    }, [handleChange]);

    return {ref, isFullscreen, controls: {enter, exit, toggle} as FullscreenControls};
}
