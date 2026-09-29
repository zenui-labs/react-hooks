import {useCallback, useEffect, useState} from 'react';
import {hasNavigator} from '../utils/env';
import {useIsMounted} from './useIsMounted';

export interface ShareResult {
    /** False when `navigator.share` is missing (most desktop Firefox and Linux browsers). */
    isSupported: boolean;
    /** True while the share sheet is open. */
    isSharing: boolean;
    /** The last failure. Cancelling the share sheet is not an error and leaves this `null`. */
    error: Error | null;
    /** Whether the browser can share this payload, for example files of a given type. */
    canShare: (data?: ShareData) => boolean;
    /** Open the native share sheet. Resolves `true` when shared, `false` when cancelled or failed. */
    share: (data: ShareData) => Promise<boolean>;
}

function supportsShare() {
    return hasNavigator && typeof navigator.share === 'function';
}

/**
 * Open the native share sheet with the Web Share API.
 * A user cancel resolves to `false` without setting `error`.
 *
 * @example
 * const {isSupported, share} = useShare();
 * <button disabled={!isSupported} onClick={() => share({title: 'Recipe', url: location.href})}>Share</button>
 */
export function useShare(): ShareResult {
    const [isSupported, setIsSupported] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const isMounted = useIsMounted();

    useEffect(() => {
        setIsSupported(supportsShare());
    }, []);

    const canShare = useCallback((data?: ShareData) => {
        if (!supportsShare()) return false;
        if (typeof navigator.canShare !== 'function') return true;
        try {
            return navigator.canShare(data);
        } catch {
            return false;
        }
    }, []);

    const share = useCallback(async (data: ShareData) => {
        if (!supportsShare()) {
            setError(new Error('The Web Share API is not supported in this browser.'));
            return false;
        }

        setIsSharing(true);
        setError(null);
        try {
            await navigator.share(data);
            return true;
        } catch (err) {
            const isCancel = (err as { name?: string } | null)?.name === 'AbortError';
            if (!isCancel && isMounted()) setError(err instanceof Error ? err : new Error(String(err)));
            return false;
        } finally {
            if (isMounted()) setIsSharing(false);
        }
    }, [isMounted]);

    return {isSupported, isSharing, error, canShare, share};
}
