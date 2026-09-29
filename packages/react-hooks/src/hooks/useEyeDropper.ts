import {useCallback, useEffect, useRef, useState} from 'react';
import {isBrowser} from '../utils/env';
import {useIsMounted} from './useIsMounted';

interface EyeDropperInstance {
    open: (options?: { signal?: AbortSignal }) => Promise<{ sRGBHex: string }>;
}

type EyeDropperConstructor = new () => EyeDropperInstance;

export interface EyeDropperResult {
    /** False when the EyeDropper API is missing (Firefox, Safari). */
    isSupported: boolean;
    /** The last picked color as a hex string, or `null`. */
    color: string | null;
    /** The last failure. Pressing Escape to cancel is not an error. */
    error: Error | null;
    /** Open the picker. Resolves with the picked color, or `null` when cancelled. */
    open: () => Promise<string | null>;
}

function getEyeDropper(): EyeDropperConstructor | null {
    if (!isBrowser) return null;
    const ctor = (window as Window & { EyeDropper?: EyeDropperConstructor }).EyeDropper;
    return typeof ctor === 'function' ? ctor : null;
}

/**
 * Pick a color from anywhere on the screen with the EyeDropper API.
 * Must be called from a user gesture such as a click.
 *
 * @example
 * const {isSupported, color, open} = useEyeDropper();
 * <button disabled={!isSupported} onClick={open}>Pick color</button>
 * {color && <span style={{background: color}}>{color}</span>}
 */
export function useEyeDropper(): EyeDropperResult {
    const [isSupported, setIsSupported] = useState(false);
    const [color, setColor] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const controllerRef = useRef<AbortController | null>(null);
    const isMounted = useIsMounted();

    useEffect(() => {
        setIsSupported(!!getEyeDropper());
        return () => controllerRef.current?.abort();
    }, []);

    const open = useCallback(async () => {
        const EyeDropper = getEyeDropper();
        if (!EyeDropper) {
            setError(new Error('The EyeDropper API is not supported in this browser.'));
            return null;
        }

        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;
        setError(null);

        try {
            const {sRGBHex} = await new EyeDropper().open({signal: controller.signal});
            if (isMounted()) setColor(sRGBHex);
            return sRGBHex;
        } catch (err) {
            const isCancel = (err as { name?: string } | null)?.name === 'AbortError';
            if (!isCancel && isMounted()) setError(err instanceof Error ? err : new Error(String(err)));
            return null;
        } finally {
            if (controllerRef.current === controller) controllerRef.current = null;
        }
    }, [isMounted]);

    return {isSupported, color, error, open};
}
