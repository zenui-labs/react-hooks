import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FullscreenControls} from '../types';
import {isBrowser} from '../utils/env';

// Safari before 16.4 only ships the webkit-prefixed Fullscreen API.
type WebkitDocument = Document & {
    webkitFullscreenElement?: Element | null;
    webkitFullscreenEnabled?: boolean;
    webkitExitFullscreen?: () => Promise<void> | void;
};

type WebkitElement = HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void;
};

function getFullscreenElement(): Element | null {
    if (!isBrowser) return null;
    const doc = document as WebkitDocument;
    return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

function ignoreRejection(result: Promise<void> | void) {
    // Requests can be rejected (no user gesture, iframe without allowfullscreen). Never leave them unhandled.
    if (result && typeof result.catch === 'function') result.catch(() => undefined);
}

/**
 * Put one element into fullscreen mode and track whether it is there.
 * Handles the webkit-prefixed API used by older Safari. Browsers only allow entering fullscreen
 * from a user gesture such as a click.
 * @example
 * const {ref, isFullscreen, controls} = useFullscreen<HTMLDivElement>();
 * <div ref={ref}><button onClick={controls.toggle}>{isFullscreen ? 'Exit' : 'Fullscreen'}</button></div>
 */
export function useFullscreen<T extends HTMLElement = HTMLElement>() {
    const ref = useRef<T | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    const enter = useCallback(() => {
        const element = ref.current as (T & WebkitElement) | null;
        if (!element) return;

        if (typeof element.requestFullscreen === 'function') {
            ignoreRejection(element.requestFullscreen());
        } else if (typeof element.webkitRequestFullscreen === 'function') {
            ignoreRejection(element.webkitRequestFullscreen());
        }
    }, []);

    const exit = useCallback(() => {
        if (!getFullscreenElement()) return;

        const doc = document as WebkitDocument;
        if (typeof doc.exitFullscreen === 'function') {
            ignoreRejection(doc.exitFullscreen());
        } else if (typeof doc.webkitExitFullscreen === 'function') {
            ignoreRejection(doc.webkitExitFullscreen());
        }
    }, []);

    // Read the live document state instead of React state, so rapid toggles never use a stale value.
    const toggle = useCallback(() => {
        if (ref.current && getFullscreenElement() === ref.current) exit();
        else enter();
    }, [enter, exit]);

    useEffect(() => {
        const doc = document as WebkitDocument;
        setIsSupported(!!(doc.fullscreenEnabled ?? doc.webkitFullscreenEnabled));

        const handleChange = () => {
            setIsFullscreen(!!ref.current && getFullscreenElement() === ref.current);
        };

        handleChange();
        document.addEventListener('fullscreenchange', handleChange);
        document.addEventListener('webkitfullscreenchange', handleChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleChange);
            document.removeEventListener('webkitfullscreenchange', handleChange);
        };
    }, []);

    const controls = useMemo<FullscreenControls>(() => ({enter, exit, toggle}), [enter, exit, toggle]);

    return {ref, isFullscreen, isSupported, controls};
}
