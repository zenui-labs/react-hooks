import {useCallback, useEffect, useState} from 'react';
import {hasNavigator} from '../utils/env';
import {useIsMounted} from './useIsMounted';

export interface MediaDeviceInfoExtended extends MediaDeviceInfo {
}

function getMediaDevices(): MediaDevices | null {
    if (!hasNavigator || !navigator.mediaDevices || typeof navigator.mediaDevices.enumerateDevices !== 'function') {
        return null;
    }
    return navigator.mediaDevices;
}

/**
 * List the cameras, microphones and speakers the browser can see, and refresh when devices change.
 * Browsers hide device labels until the page has camera or microphone permission.
 * Call `requestPermission` to ask for it and re-read the list with labels.
 * @example
 * const {devices, requestPermission} = useMediaDevices();
 * const cameras = devices.filter(d => d.kind === 'videoinput');
 */
export function useMediaDevices() {
    const [devices, setDevices] = useState<MediaDeviceInfoExtended[]>([]);
    const [isSupported, setIsSupported] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const isMounted = useIsMounted();

    const refresh = useCallback(async () => {
        const mediaDevices = getMediaDevices();
        if (!mediaDevices) return;

        try {
            const list = await mediaDevices.enumerateDevices();
            if (isMounted()) {
                setDevices(list);
                setError(null);
            }
        } catch (err) {
            if (isMounted()) setError(err instanceof Error ? err : new Error(String(err)));
        }
    }, [isMounted]);

    useEffect(() => {
        const mediaDevices = getMediaDevices();
        setIsSupported(!!mediaDevices);
        if (!mediaDevices) return;

        void refresh();

        mediaDevices.addEventListener('devicechange', refresh);
        return () => mediaDevices.removeEventListener('devicechange', refresh);
    }, [refresh]);

    const requestPermission = useCallback(async (
        constraints: MediaStreamConstraints = {audio: true, video: true}
    ): Promise<boolean> => {
        const mediaDevices = getMediaDevices();
        if (!mediaDevices || typeof mediaDevices.getUserMedia !== 'function') return false;

        try {
            const stream = await mediaDevices.getUserMedia(constraints);
            // Only the permission is needed. Release the camera and microphone right away.
            stream.getTracks().forEach(track => track.stop());
            await refresh();
            return true;
        } catch (err) {
            if (isMounted()) setError(err instanceof Error ? err : new Error(String(err)));
            return false;
        }
    }, [isMounted, refresh]);

    return {devices, isSupported, error, requestPermission};
}
