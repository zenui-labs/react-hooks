import {useEffect, useRef} from 'react';
import {isBrowser} from '../utils/env';
import {useLatest} from './useLatest';

export interface DocumentTitleOptions {
    /** Put back the title that was set before this component mounted. Defaults to `true`. */
    restoreOnUnmount?: boolean;
}

/**
 * Set `document.title` while the component is mounted and restore the previous title afterwards.
 *
 * @example
 * useDocumentTitle(unread > 0 ? `(${unread}) Inbox` : 'Inbox');
 */
export function useDocumentTitle(title: string, options: DocumentTitleOptions = {}): void {
    const {restoreOnUnmount = true} = options;
    const previousRef = useRef<string | null>(null);
    const restoreRef = useLatest(restoreOnUnmount);

    // Declared before the title effect so it captures the title this component replaced.
    useEffect(() => {
        if (!isBrowser) return;
        previousRef.current = document.title;

        return () => {
            if (restoreRef.current && previousRef.current !== null) document.title = previousRef.current;
        };
    }, [restoreRef]);

    useEffect(() => {
        if (isBrowser) document.title = title;
    }, [title]);
}
