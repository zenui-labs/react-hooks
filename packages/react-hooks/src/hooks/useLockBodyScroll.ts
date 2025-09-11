import {useLayoutEffect} from 'react';

export function useLockBodyScroll(lock: boolean = true) {
    useLayoutEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;

        if (lock) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, [lock]);
}
