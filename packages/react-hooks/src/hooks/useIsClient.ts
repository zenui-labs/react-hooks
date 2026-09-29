import {useEffect, useState} from 'react';

/**
 * `false` during SSR and the first client render, `true` after hydration.
 * Use it to render browser-only UI without hydration mismatches.
 */
export function useIsClient() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return isClient;
}
