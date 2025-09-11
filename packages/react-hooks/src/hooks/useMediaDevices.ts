import {useEffect, useState} from 'react';

export interface MediaDeviceInfoExtended extends MediaDeviceInfo {
}

export function useMediaDevices() {
    const [devices, setDevices] = useState<MediaDeviceInfoExtended[]>([]);

    useEffect(() => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            console.warn('MediaDevices API not supported in this browser.');
            return;
        }

        const updateDevices = async () => {
            try {
                const list = await navigator.mediaDevices.enumerateDevices();
                setDevices(list);
            } catch (error) {
                console.error('Error fetching media devices:', error);
            }
        };

        updateDevices();

        navigator.mediaDevices.addEventListener('devicechange', updateDevices);

        return () => {
            navigator.mediaDevices.removeEventListener('devicechange', updateDevices);
        };
    }, []);

    return {devices};
}
