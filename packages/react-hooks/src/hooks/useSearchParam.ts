import {useCallback, useState} from 'react';
import {SearchParamOptions} from '../types';
import {isBrowser} from '../utils/env';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';
import {LOCATION_CHANGE_EVENT, subscribeToLocation} from './useLocation';

function readParam(key: string): string | null {
    return new URLSearchParams(window.location.search).get(key);
}

/**
 * Read and write one query string parameter. Every component using the same key stays in sync,
 * and back and forward navigation updates the value. Returns `null` when the parameter is absent.
 * @example
 * const {value: tab, setValue: setTab} = useSearchParam('tab');
 * <button onClick={() => setTab('billing', {replace: true})}>Billing</button>
 */
export function useSearchParam(key: string) {
    const [value, setValue] = useState<string | null>(null);

    useIsomorphicLayoutEffect(() => {
        const update = () => setValue(readParam(key));
        update();
        return subscribeToLocation(update);
    }, [key]);

    const setSearchParam = useCallback((newValue: string | null, options: SearchParamOptions = {}) => {
        if (!isBrowser) return;

        const url = new URL(window.location.href);
        if (newValue === null) {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, newValue);
        }

        setValue(newValue);
        if (url.href === window.location.href) return;

        if (options.replace) {
            window.history.replaceState(null, '', url.href);
        } else {
            window.history.pushState(null, '', url.href);
        }

        // Notify other instances right away instead of waiting for the queued history event.
        window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
    }, [key]);

    return {value, setValue: setSearchParam};
}
