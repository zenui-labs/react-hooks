import {useCallback, useEffect, useState} from 'react';

export function useHash() {
    const [hash, setHash] = useState<string>(() => window.location.hash);

    useEffect(() => {
        const onHashChange = () => setHash(window.location.hash);
        window.addEventListener('hashchange', onHashChange);

        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const updateHash = useCallback((newHash: string) => {
        if (!newHash.startsWith('#')) {
            window.location.hash = `#${newHash}`;
        } else {
            window.location.hash = newHash;
        }
    }, []);

    return {hash, setHash: updateHash};
}
