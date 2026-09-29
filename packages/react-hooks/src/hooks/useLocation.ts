import {useState} from 'react';
import {LocationState} from '../types';
import {isBrowser} from '../utils/env';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

/** Dispatched on `window` after `history.pushState` or `history.replaceState`. */
export const LOCATION_CHANGE_EVENT = 'zenui:locationchange';

const PATCHED = '__zenuiHistoryPatched';

// pushState and replaceState fire no event, so client routers would go unnoticed.
// Wrap them once to announce the change. The event is queued so listeners never
// set state in the middle of a router's render or insertion effect.
function patchHistory() {
    const history = window.history as History & { [PATCHED]?: boolean };
    if (history[PATCHED]) return;
    history[PATCHED] = true;

    const notify = () => {
        const dispatch = () => window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
        if (typeof queueMicrotask === 'function') queueMicrotask(dispatch);
        else void Promise.resolve().then(dispatch);
    };

    for (const method of ['pushState', 'replaceState'] as const) {
        const original = history[method];
        history[method] = function (this: History, ...args: Parameters<History['pushState']>) {
            const result = original.apply(this, args);
            notify();
            return result;
        };
    }
}

/**
 * Subscribe to every URL change: back and forward, hash changes and history push or replace.
 * Returns an unsubscribe function. Shared by the URL hooks.
 */
export function subscribeToLocation(listener: () => void): () => void {
    if (!isBrowser) return () => undefined;

    patchHistory();
    window.addEventListener('popstate', listener);
    window.addEventListener('hashchange', listener);
    window.addEventListener(LOCATION_CHANGE_EVENT, listener);

    return () => {
        window.removeEventListener('popstate', listener);
        window.removeEventListener('hashchange', listener);
        window.removeEventListener(LOCATION_CHANGE_EVENT, listener);
    };
}

const EMPTY: LocationState = {pathname: '', search: '', hash: ''};

function readLocation(): LocationState {
    const {pathname, search, hash} = window.location;
    return {pathname, search, hash};
}

/**
 * Track `pathname`, `search` and `hash` of the current URL.
 * Updates on back and forward navigation, hash changes and `history.pushState` or `replaceState`
 * calls, which covers most client-side routers. Values are empty strings during server rendering.
 * @example
 * const {pathname, search} = useLocation();
 * return <p>You are on {pathname}{search}</p>;
 */
export function useLocation(): LocationState {
    const [location, setLocation] = useState<LocationState>(EMPTY);

    useIsomorphicLayoutEffect(() => {
        const update = () => {
            const next = readLocation();
            setLocation(prev => (
                prev.pathname === next.pathname && prev.search === next.search && prev.hash === next.hash
                    ? prev
                    : next
            ));
        };

        update();
        return subscribeToLocation(update);
    }, []);

    return location;
}
