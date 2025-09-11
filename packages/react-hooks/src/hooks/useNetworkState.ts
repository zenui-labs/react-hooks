import {useEffect, useState} from 'react';
import {NetworkState} from "../types";

export function useNetworkState(): NetworkState {
    const [state, setState] = useState<NetworkState>({
        online: navigator.onLine,
        since: navigator.onLine ? new Date() : undefined,
    });

    useEffect(() => {
        const handleOnline = () => setState({online: true, since: new Date()});
        const handleOffline = () => setState({online: false, since: new Date()});

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return state;
}
