import {useState} from 'react';
import {NetworkState} from '../types';
import {hasNavigator, isBrowser} from '../utils/env';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

// The Network Information API is not in the TypeScript DOM lib and only exists in Chromium browsers.
interface NetworkInformationLike extends EventTarget {
    effectiveType?: NetworkState['effectiveType'];
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
}

function getConnection(): NetworkInformationLike | undefined {
    if (!hasNavigator) return undefined;
    return (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
}

function readConnection(): Pick<NetworkState, 'effectiveType' | 'downlink' | 'rtt' | 'saveData'> {
    const connection = getConnection();
    if (!connection) return {};

    return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
    };
}

/**
 * Track whether the browser is online, when that last changed, and connection quality where the
 * Network Information API exists. Assumes online during server rendering.
 * @example
 * const {online, effectiveType} = useNetworkState();
 * if (!online) return <Banner>You are offline</Banner>;
 */
export function useNetworkState(): NetworkState {
    const [state, setState] = useState<NetworkState>({online: true});

    useIsomorphicLayoutEffect(() => {
        if (!isBrowser) return;

        const online = hasNavigator ? navigator.onLine : true;
        setState({online, since: new Date(), ...readConnection()});

        const handleOnline = () => setState({online: true, since: new Date(), ...readConnection()});
        const handleOffline = () => setState({online: false, since: new Date(), ...readConnection()});
        const handleConnection = () => setState(prev => ({...prev, ...readConnection()}));

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        const connection = getConnection();
        connection?.addEventListener('change', handleConnection);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            connection?.removeEventListener('change', handleConnection);
        };
    }, []);

    return state;
}
