import {useEffect} from 'react';
import {useLatest} from './useLatest';

/**
 * Call `callback` when the pointer leaves the page, for example toward the tab bar or address bar.
 * Use it for exit-intent prompts. It does not block navigation or show a "Leave site?" dialog.
 * @example
 * usePageLeave(() => setShowOffer(true));
 */
export function usePageLeave(callback: (event?: MouseEvent) => void) {
    const callbackRef = useLatest(callback);

    useEffect(() => {
        const handleMouseOut = (event: MouseEvent) => {
            // relatedTarget is null when the pointer moves outside the document. The edge check
            // filters out the same null value some browsers report when entering an iframe.
            if (event.relatedTarget !== null) return;

            const {clientX, clientY} = event;
            const atEdge = clientY <= 0 || clientX <= 0
                || clientX >= window.innerWidth - 1 || clientY >= window.innerHeight - 1;

            if (atEdge) callbackRef.current(event);
        };

        document.addEventListener('mouseout', handleMouseOut);

        return () => document.removeEventListener('mouseout', handleMouseOut);
    }, [callbackRef]);
}
