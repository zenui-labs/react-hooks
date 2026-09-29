import {useCallback, useEffect, useRef, useState} from 'react';
import {hasNavigator, isBrowser} from '../utils/env';
import {useIsMounted} from './useIsMounted';
import {useLatest} from './useLatest';

// Fallback for insecure contexts (plain http) and older browsers without the async Clipboard API.
function copyWithTextarea(text: string): boolean {
    if (!isBrowser || !document.body) return false;

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';

    const selection = document.getSelection();
    const previousRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    document.body.appendChild(textarea);
    textarea.select();

    let copied = false;
    try {
        copied = document.execCommand('copy');
    } catch {
        copied = false;
    }

    document.body.removeChild(textarea);

    if (previousRange && selection) {
        selection.removeAllRanges();
        selection.addRange(previousRange);
    }

    return copied;
}

/**
 * Copy text to the clipboard and expose a short-lived `isCopied` flag for UI feedback.
 * Falls back to a hidden textarea when the async Clipboard API is unavailable.
 * @example
 * const {isCopied, copyToClipboard} = useCopyToClipboard();
 * <button onClick={() => copyToClipboard(token)}>{isCopied ? 'Copied' : 'Copy'}</button>
 */
export function useCopyToClipboard(resetAfter: number = 2000) {
    const [isCopied, setIsCopied] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const resetAfterRef = useLatest(resetAfter);
    const isMounted = useIsMounted();

    const clearTimer = useCallback(() => {
        if (timer.current !== null) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    }, []);

    useEffect(() => clearTimer, [clearTimer]);

    const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
        clearTimer();

        let copied = false;
        let failure: unknown = null;

        const clipboard = hasNavigator ? navigator.clipboard : undefined;
        if (clipboard && typeof clipboard.writeText === 'function') {
            try {
                await clipboard.writeText(text);
                copied = true;
            } catch (err) {
                failure = err;
            }
        }

        if (!copied) {
            copied = copyWithTextarea(text);
        }

        if (!isMounted()) return copied;

        if (copied) {
            setError(null);
            setIsCopied(true);
            if (resetAfterRef.current > 0) {
                timer.current = setTimeout(() => {
                    timer.current = null;
                    setIsCopied(false);
                }, resetAfterRef.current);
            }
        } else {
            setIsCopied(false);
            setError(failure instanceof Error ? failure : new Error('Copying to the clipboard is not supported here.'));
        }

        return copied;
    }, [clearTimer, isMounted, resetAfterRef]);

    return {isCopied, copyToClipboard, error};
}
