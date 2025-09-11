import {useEffect, useState} from 'react';

export function useMedia(query: string, defaultState: boolean = false) {
    const [matches, setMatches] = useState(defaultState);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;

        const mediaQuery = window.matchMedia(query);

        setMatches(mediaQuery.matches);

        const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

        mediaQuery.addEventListener('change', handler);

        return () => mediaQuery.removeEventListener('change', handler);
    }, [query]);

    return {matches};
}
