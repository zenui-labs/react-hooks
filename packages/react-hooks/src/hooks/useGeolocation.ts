import {useEffect, useState} from 'react';
import {GeolocationState} from "../types";

export function useGeolocation() {
    const [position, setPosition] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: null,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setPosition(prev => ({...prev, error: 'Geolocation is not supported by your browser.'}));
            return;
        }

        const success = (pos: GeolocationPosition) => {
            const {latitude, longitude, accuracy} = pos.coords;
            setPosition({latitude, longitude, accuracy, error: null});
        };

        const error = (err: GeolocationPositionError) => {
            setPosition(prev => ({...prev, error: err.message}));
        };

        const watcherId = navigator.geolocation.watchPosition(success, error);

        return () => navigator.geolocation.clearWatch(watcherId);
    }, []);

    return {...position};
}
