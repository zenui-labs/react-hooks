import {useState} from 'react';
import {isBrowser} from '../utils/env';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * `true` when the user asked the OS to reduce motion. Updates live when the setting changes.
 * Returns `false` on the server and before the first client effect.
 *
 * @example
 * const reduce = useReducedMotion();
 * const style = {transition: reduce ? 'none' : 'transform 300ms ease'};
 */
export function useReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false);

    useIsomorphicLayoutEffect(() => {
        if (!isBrowser || typeof window.matchMedia !== 'function') return;

        const mql = window.matchMedia(QUERY);
        const onChange = () => setReduced(mql.matches);
        onChange();

        if (typeof mql.addEventListener === 'function') {
            mql.addEventListener('change', onChange);
            return () => mql.removeEventListener('change', onChange);
        }

        // Safari before 14 only supports the deprecated listener API.
        mql.addListener(onChange);
        return () => mql.removeListener(onChange);
    }, []);

    return reduced;
}
