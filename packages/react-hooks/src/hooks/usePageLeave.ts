import {useEffect} from 'react';

export function usePageLeave(callback: (event?: BeforeUnloadEvent) => void) {
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            callback(event);
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [callback]);
}
