import {useEffect, useState} from 'react';
import {hasNavigator} from '../utils/env';

export type PermissionQueryName = PermissionName | 'clipboard-read' | 'clipboard-write' | (string & {});

export type PermissionQueryState = 'granted' | 'denied' | 'prompt' | 'unsupported';

/**
 * Track the live Permissions API state for a permission name.
 * Returns `'unsupported'` when the API or the permission name is not available.
 *
 * @example
 * const camera = usePermission('camera');
 * if (camera === 'denied') return <p>Camera access is blocked.</p>;
 */
export function usePermission(name: PermissionQueryName): PermissionQueryState {
    const [state, setState] = useState<PermissionQueryState>('prompt');

    useEffect(() => {
        if (!hasNavigator || !navigator.permissions || typeof navigator.permissions.query !== 'function') {
            setState('unsupported');
            return;
        }

        let cancelled = false;
        let status: PermissionStatus | null = null;

        const onChange = () => {
            if (!cancelled && status) setState(status.state as PermissionQueryState);
        };

        navigator.permissions
            .query({name: name as PermissionName})
            .then((result) => {
                if (cancelled) return;
                status = result;
                setState(result.state as PermissionQueryState);
                result.addEventListener('change', onChange);
            })
            .catch(() => {
                // Unknown permission names reject (for example 'camera' in Firefox).
                if (!cancelled) setState('unsupported');
            });

        return () => {
            cancelled = true;
            if (status) status.removeEventListener('change', onChange);
        };
    }, [name]);

    return state;
}
