import {useCallback, useState} from 'react';
import {isBrowser} from '../utils/env';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

/**
 * Read and update `window.location.hash`, including the leading `#`.
 * Empty during server rendering, then synced before the first paint.
 * @example
 * const {hash, setHash} = useHash();
 * <button onClick={() => setHash('pricing')}>Jump to pricing</button>
 */
export function useHash() {
    const [hash, setHash] = useState<string>('');

    useIsomorphicLayoutEffect(() => {
        const onHashChange = () => setHash(window.location.hash);
        onHashChange();

        window.addEventListener('hashchange', onHashChange);
        window.addEventListener('popstate', onHashChange);

        return () => {
            window.removeEventListener('hashchange', onHashChange);
            window.removeEventListener('popstate', onHashChange);
        };
    }, []);

    const updateHash = useCallback((newHash: string) => {
        if (!isBrowser) return;

        const next = newHash.startsWith('#') ? newHash : `#${newHash}`;
        if (next !== window.location.hash) {
            window.location.hash = next;
        }
    }, []);

    return {hash, setHash: updateHash};
}
