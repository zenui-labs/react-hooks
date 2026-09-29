import {useEffect, useRef, useState} from 'react';

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel', 'scroll'] as const;

/**
 * Report when the user has not interacted with the page for `timeout` milliseconds.
 * Activity events only update a timestamp, so constant mouse movement costs no renders.
 * @example
 * const {isIdle, lastActive} = useIdle(30_000);
 * if (isIdle) return <p>Still there?</p>;
 */
export function useIdle(timeout: number = 60000) {
    const [isIdle, setIsIdle] = useState(false);
    const [lastActive, setLastActive] = useState<number | null>(null);
    const idleRef = useRef(false);
    const lastActiveRef = useRef(0);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | null = null;

        // One timer per `timeout` window. When it fires, check how long ago the last activity was
        // and either flag the user as idle or wait for the remaining time.
        const check = () => {
            const elapsed = Date.now() - lastActiveRef.current;
            if (elapsed >= timeout) {
                timer = null;
                idleRef.current = true;
                setIsIdle(true);
                setLastActive(lastActiveRef.current);
            } else {
                timer = setTimeout(check, timeout - elapsed);
            }
        };

        const onActivity = () => {
            const now = Date.now();
            lastActiveRef.current = now;

            if (idleRef.current) {
                idleRef.current = false;
                setIsIdle(false);
                setLastActive(now);
            }

            if (timer === null) {
                timer = setTimeout(check, timeout);
            }
        };

        const onVisibility = () => {
            if (document.visibilityState === 'visible') onActivity();
        };

        const listenerOptions: AddEventListenerOptions = {passive: true, capture: true};
        ACTIVITY_EVENTS.forEach(event => window.addEventListener(event, onActivity, listenerOptions));
        document.addEventListener('visibilitychange', onVisibility);

        lastActiveRef.current = Date.now();
        idleRef.current = false;
        setIsIdle(false);
        setLastActive(lastActiveRef.current);
        timer = setTimeout(check, timeout);

        return () => {
            if (timer !== null) clearTimeout(timer);
            ACTIVITY_EVENTS.forEach(event => window.removeEventListener(event, onActivity, listenerOptions));
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [timeout]);

    return {isIdle, lastActive};
}
