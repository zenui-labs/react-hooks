import {useState} from 'react';
import {isBrowser} from '../utils/env';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';
import {useLatest} from './useLatest';

export type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface ScriptOptions {
    /** Extra attributes for the `<script>` tag, such as `integrity` or `crossorigin`. Read once, when the tag is created. */
    attributes?: Record<string, string>;
    /** Remove the tag when the last component using this `src` unmounts. Defaults to `false`. */
    removeOnUnmount?: boolean;
}

interface ScriptEntry {
    status: ScriptStatus;
    element: HTMLScriptElement;
    listeners: Set<(status: ScriptStatus) => void>;
    users: number;
}

// Shared across every hook instance so each src is requested once per page.
const scripts = new Map<string, ScriptEntry>();

function findExisting(src: string): HTMLScriptElement | null {
    const all = document.getElementsByTagName('script');
    for (let i = 0; i < all.length; i++) {
        if (all[i].getAttribute('src') === src) return all[i];
    }
    return null;
}

function createEntry(src: string, attributes: Record<string, string> | undefined): ScriptEntry {
    const existing = findExisting(src);
    const element = existing ?? document.createElement('script');
    // A tag that was already on the page and not created by this hook is assumed to have loaded.
    const known = existing?.getAttribute('data-status');
    const entry: ScriptEntry = {
        status: existing ? (known === 'loading' || known === 'error' ? known : 'ready') : 'loading',
        element,
        listeners: new Set(),
        users: 0,
    };

    const settle = (status: ScriptStatus) => {
        entry.status = status;
        element.setAttribute('data-status', status);
        entry.listeners.forEach((listener) => listener(status));
    };
    element.addEventListener('load', () => settle('ready'));
    element.addEventListener('error', () => settle('error'));

    if (!existing) {
        element.src = src;
        element.async = true;
        element.setAttribute('data-status', 'loading');
        if (attributes) {
            Object.keys(attributes).forEach((name) => element.setAttribute(name, attributes[name]));
        }
        document.body.appendChild(element);
    }

    return entry;
}

/**
 * Load an external script and report its status. Each `src` is injected once, however many
 * components ask for it. Pass `null` to wait (status `'idle'`).
 *
 * @example
 * const status = useScript('https://js.stripe.com/v3/');
 * if (status === 'ready') window.Stripe(key);
 */
export function useScript(src: string | null, options: ScriptOptions = {}): ScriptStatus {
    const [status, setStatus] = useState<ScriptStatus>(src ? 'loading' : 'idle');
    const optionsRef = useLatest(options);

    useIsomorphicLayoutEffect(() => {
        if (!src) {
            setStatus('idle');
            return;
        }
        if (!isBrowser) return;

        let entry = scripts.get(src);
        if (!entry) {
            entry = createEntry(src, optionsRef.current.attributes);
            scripts.set(src, entry);
        }

        const current = entry;
        current.users += 1;
        current.listeners.add(setStatus);
        setStatus(current.status);

        return () => {
            current.listeners.delete(setStatus);
            current.users -= 1;
            if (current.users > 0) return;

            // Forget failed loads so a later mount can retry.
            if (optionsRef.current.removeOnUnmount || current.status === 'error') {
                current.element.remove();
                scripts.delete(src);
            }
        };
    }, [src, optionsRef]);

    return status;
}
