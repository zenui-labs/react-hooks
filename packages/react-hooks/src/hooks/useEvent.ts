import {RefObject, useEffect, useRef} from 'react';
import {EventOptions} from "../types";

export function useEvent<
    K extends keyof WindowEventMap,
    T extends HTMLElement | Window | Document = Window
>(
    type: K,
    listener: (event: WindowEventMap[K]) => void,
    target?: RefObject<T> | T,
    options?: EventOptions
) {
    const savedListener = useRef(listener);

    useEffect(() => {
        savedListener.current = listener;
    }, [listener]);

    useEffect(() => {
        const targetElement: T = target && 'current' in target ? target.current! : (window as unknown as T);
        if (!targetElement) return;

        const eventListener = (event: Event) => savedListener.current(event as WindowEventMap[K]);

        targetElement.addEventListener(type, eventListener, options);

        return () => {
            targetElement.removeEventListener(type, eventListener, options);
        };
    }, [type, target, options]);
}
