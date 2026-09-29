import {useState} from 'react';
import {isBrowser} from '../utils/env';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

/**
 * Track whether a CSS media query matches.
 * Renders `defaultState` on the server and on the first client render, then syncs before paint,
 * so hydration never mismatches.
 * @example
 * const {matches: isWide} = useMedia('(min-width: 1024px)');
 * return isWide ? <Sidebar /> : <MenuButton />;
 */
export function useMedia(query: string, defaultState: boolean = false) {
    const [matches, setMatches] = useState(defaultState);

    useIsomorphicLayoutEffect(() => {
        if (!isBrowser || typeof window.matchMedia !== 'function') return;

        const mediaQuery = window.matchMedia(query);
        const update = () => setMatches(mediaQuery.matches);
        update();

        // Safari before 14 only supports the deprecated addListener API.
        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', update);
            return () => mediaQuery.removeEventListener('change', update);
        }

        mediaQuery.addListener(update);
        return () => mediaQuery.removeListener(update);
    }, [query]);

    return {matches};
}
