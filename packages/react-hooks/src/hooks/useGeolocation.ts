import {useEffect, useState} from 'react';
import {GeolocationOptions, GeolocationState} from '../types';
import {hasNavigator} from '../utils/env';

/**
 * Watch the device position with the Geolocation API.
 * The browser asks for permission on mount. `loading` stays true until the first fix or error.
 * @example
 * const {latitude, longitude, accuracy, loading, error} = useGeolocation({enableHighAccuracy: true});
 * if (loading) return <p>Locating...</p>;
 */
export function useGeolocation(options: GeolocationOptions = {}): GeolocationState {
    const {enableHighAccuracy, timeout, maximumAge} = options;
    const [position, setPosition] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: null,
        loading: true,
        isSupported: true,
        timestamp: null,
    });

    useEffect(() => {
        if (!hasNavigator || !navigator.geolocation) {
            setPosition(prev => ({
                ...prev,
                loading: false,
                isSupported: false,
                error: 'Geolocation is not supported by your browser.',
            }));
            return;
        }

        let active = true;

        const success = (pos: GeolocationPosition) => {
            if (!active) return;
            const {latitude, longitude, accuracy} = pos.coords;
            setPosition({
                latitude,
                longitude,
                accuracy,
                error: null,
                loading: false,
                isSupported: true,
                timestamp: pos.timestamp,
            });
        };

        const error = (err: GeolocationPositionError) => {
            if (!active) return;
            setPosition(prev => ({...prev, error: err.message, loading: false}));
        };

        const watcherId = navigator.geolocation.watchPosition(success, error, {
            enableHighAccuracy,
            timeout,
            maximumAge,
        });

        return () => {
            active = false;
            navigator.geolocation.clearWatch(watcherId);
        };
    }, [enableHighAccuracy, timeout, maximumAge]);

    return position;
}
