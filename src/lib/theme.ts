'use client'

import {useCallback, useEffect, useState} from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'rh-theme';

/**
 * Inline script for <head>. Runs before first paint so the page never flashes
 * the wrong theme. Dark is the default when nothing is stored.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t='dark'}document.documentElement.classList.toggle('dark',t==='dark')}catch(e){document.documentElement.classList.add('dark')}})()`;

function readTheme(): Theme {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/** Site theme. Every instance stays in sync through a MutationObserver on <html>. */
export function useSiteTheme() {
    const [theme, setThemeState] = useState<Theme>('dark');

    useEffect(() => {
        setThemeState(readTheme());
        const observer = new MutationObserver(() => setThemeState(readTheme()));
        observer.observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
        return () => observer.disconnect();
    }, []);

    const setTheme = useCallback((next: Theme) => {
        document.documentElement.classList.toggle('dark', next === 'dark');
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // Storage can be blocked (private mode). The class change still applies.
        }
    }, []);

    const toggle = useCallback(() => setTheme(readTheme() === 'dark' ? 'light' : 'dark'), [setTheme]);

    return {theme, setTheme, toggle};
}
