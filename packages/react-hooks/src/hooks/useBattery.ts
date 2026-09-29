import {useEffect, useState} from 'react';
import {hasNavigator} from '../utils/env';

/** The subset of the Battery Status API `BatteryManager` the hook reads. */
interface BatteryManagerLike extends EventTarget {
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
}

export interface BatteryState {
    /** False when `navigator.getBattery` is missing (Firefox, Safari). */
    isSupported: boolean;
    /** Charge level from 0 to 1. */
    level: number;
    charging: boolean;
    /** Seconds until fully charged. `Infinity` when discharging or unknown. */
    chargingTime: number;
    /** Seconds until empty. `Infinity` when charging or unknown. */
    dischargingTime: number;
}

const BATTERY_EVENTS = ['levelchange', 'chargingchange', 'chargingtimechange', 'dischargingtimechange'];

const INITIAL: BatteryState = {
    isSupported: false,
    level: 1,
    charging: false,
    chargingTime: Infinity,
    dischargingTime: Infinity,
};

/**
 * Read the device battery level and charging state from the Battery Status API.
 * Updates when the level or charging state changes.
 *
 * @example
 * const {isSupported, level, charging} = useBattery();
 * if (isSupported && level < 0.2 && !charging) return <p>Battery low.</p>;
 */
export function useBattery(): BatteryState {
    const [state, setState] = useState<BatteryState>(INITIAL);

    useEffect(() => {
        const nav = hasNavigator
            ? (navigator as Navigator & { getBattery?: () => Promise<BatteryManagerLike> })
            : null;
        if (!nav || typeof nav.getBattery !== 'function') return;

        let cancelled = false;
        let battery: BatteryManagerLike | null = null;
        // Report support right away; the first reading arrives asynchronously.
        setState((prev) => (prev.isSupported ? prev : {...prev, isSupported: true}));

        const read = () => {
            if (cancelled || !battery) return;
            setState({
                isSupported: true,
                level: battery.level,
                charging: battery.charging,
                chargingTime: battery.chargingTime,
                dischargingTime: battery.dischargingTime,
            });
        };

        nav.getBattery()
            .then((manager) => {
                if (cancelled) return;
                battery = manager;
                read();
                BATTERY_EVENTS.forEach((type) => manager.addEventListener(type, read));
            })
            .catch(() => {
                // Blocked by a permissions policy, for example inside some iframes.
                if (!cancelled) setState(INITIAL);
            });

        return () => {
            cancelled = true;
            const manager = battery;
            if (manager) BATTERY_EVENTS.forEach((type) => manager.removeEventListener(type, read));
        };
    }, []);

    return state;
}
