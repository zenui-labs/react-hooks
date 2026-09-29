import {useState} from 'react';
import {VisibilityState} from '../types';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

/**
 * Track whether the page is visible or hidden in a background tab or minimized window.
 * Reports visible during server rendering and syncs before the first paint.
 * @example
 * const {hidden} = useVisibilityChange();
 * useEffect(() => { if (hidden) video.pause(); }, [hidden]);
 */
export function useVisibilityChange(): VisibilityState {
    const [state, setState] = useState<VisibilityState>({visible: true, hidden: false});

    useIsomorphicLayoutEffect(() => {
        const handleVisibilityChange = () => {
            const hidden = document.hidden;
            setState(prev => (prev.hidden === hidden ? prev : {visible: !hidden, hidden}));
        };

        handleVisibilityChange();
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    return state;
}
