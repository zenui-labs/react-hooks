import {useEffect, useRef} from 'react';

export interface WhyDidYouUpdateChange {
    from: unknown;
    to: unknown;
}

export type WhyDidYouUpdateChanges = Record<string, WhyDidYouUpdateChange>;

/**
 * Debug helper that reports which props changed since the last render.
 * Logs the changes with `console.log` and returns them. Remove it before shipping.
 *
 * @example
 * function Chart(props: ChartProps) {
 *     useWhyDidYouUpdate('Chart', props);
 *     // ...
 * }
 */
export function useWhyDidYouUpdate<P extends object>(name: string, props: P): WhyDidYouUpdateChanges {
    // Holds the props of the last committed render, so a discarded render never becomes the baseline.
    const previousRef = useRef<P | null>(null);

    const changes: WhyDidYouUpdateChanges = {};
    const previous = previousRef.current;
    if (previous) {
        const prev = previous as Record<string, unknown>;
        const next = props as Record<string, unknown>;
        const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
        keys.forEach((key) => {
            if (!Object.is(prev[key], next[key])) changes[key] = {from: prev[key], to: next[key]};
        });
    }

    useEffect(() => {
        previousRef.current = props;
        if (Object.keys(changes).length > 0) console.log('[why-did-you-update]', name, changes);
    });

    return changes;
}
