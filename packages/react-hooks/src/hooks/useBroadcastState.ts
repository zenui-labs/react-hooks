import {useCallback, useEffect, useRef, useState} from 'react';
import {isBrowser} from '../utils/env';

export type BroadcastStateTransport = 'broadcast-channel' | 'storage' | 'none';

export type BroadcastStateAction<T> = T | ((previous: T) => T);

export interface BroadcastStateMeta {
    /** True when the value can reach other tabs (BroadcastChannel or localStorage). False during SSR. */
    isSupported: boolean;
    /** Which mechanism carries updates between tabs. */
    transport: BroadcastStateTransport;
    /** Where the current value came from: the initial value, this tab, or another tab. */
    source: 'initial' | 'local' | 'remote';
}

export type BroadcastState<T> = [T, (value: BroadcastStateAction<T>) => void, BroadcastStateMeta];

interface BroadcastMessage<T> {
    type: 'set' | 'hello';
    sender: string;
    stamp: number;
    value?: T;
}

const STORAGE_PREFIX = 'zenui:broadcast:';

function createId() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * State shared by every tab of the same origin. Uses BroadcastChannel and falls back to
 * the `storage` event. Values must be structured-cloneable and JSON-serializable.
 * @example
 * const [theme, setTheme, {isSupported}] = useBroadcastState('theme', 'light');
 * <button onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}>{theme}</button>
 */
export function useBroadcastState<T>(channel: string, initial: T): BroadcastState<T> {
    const [state, setState] = useState<T>(initial);
    const [meta, setMeta] = useState<BroadcastStateMeta>({isSupported: false, transport: 'none', source: 'initial'});

    const stateRef = useRef(state);
    const idRef = useRef<string | null>(null);
    // Last-writer-wins clock. 0 means this tab still holds the initial value.
    const stampRef = useRef(0);
    const postRef = useRef<((message: BroadcastMessage<T>) => void) | null>(null);

    const apply = useCallback((value: T, stamp: number, source: BroadcastStateMeta['source']) => {
        stateRef.current = value;
        stampRef.current = stamp;
        setState(value);
        setMeta((current) => current.source === source ? current : {...current, source});
    }, []);

    useEffect(() => {
        if (!isBrowser) {
            return;
        }

        const id = idRef.current ?? (idRef.current = createId());
        const storageKey = STORAGE_PREFIX + channel;

        const receive = (message: BroadcastMessage<T> | null) => {
            if (!message || message.sender === id) {
                return;
            }

            if (message.type === 'hello') {
                // A new tab joined. Share our value when we have one worth sharing.
                if (stampRef.current > 0) {
                    postRef.current?.({type: 'set', sender: id, stamp: stampRef.current, value: stateRef.current});
                }
                return;
            }

            const newer = message.stamp > stampRef.current
                || (message.stamp === stampRef.current && message.sender > id);
            if (newer && 'value' in message) {
                apply(message.value as T, message.stamp, 'remote');
            }
        };

        if (typeof BroadcastChannel !== 'undefined') {
            const bc = new BroadcastChannel(storageKey);
            bc.onmessage = (event: MessageEvent<BroadcastMessage<T>>) => receive(event.data);
            postRef.current = (message) => {
                try {
                    bc.postMessage(message);
                } catch {
                    // Value is not structured-cloneable. The local update still applies.
                }
            };
            setMeta((current) => ({...current, isSupported: true, transport: 'broadcast-channel'}));
            bc.postMessage({type: 'hello', sender: id, stamp: 0} satisfies BroadcastMessage<T>);

            return () => {
                postRef.current = null;
                bc.onmessage = null;
                bc.close();
            };
        }

        let storage: Storage | null = null;
        try {
            storage = window.localStorage;
        } catch {
            storage = null;
        }

        if (!storage) {
            return;
        }

        const store = storage;
        const read = (raw: string | null): BroadcastMessage<T> | null => {
            if (!raw) {
                return null;
            }
            try {
                return JSON.parse(raw) as BroadcastMessage<T>;
            } catch {
                return null;
            }
        };

        postRef.current = (message) => {
            try {
                store.setItem(storageKey, JSON.stringify(message));
            } catch {
                // Quota exceeded or value not serializable. The local update still applies.
            }
        };

        const onStorage = (event: StorageEvent) => {
            if (event.storageArea === store && event.key === storageKey) {
                receive(read(event.newValue));
            }
        };

        window.addEventListener('storage', onStorage);
        setMeta((current) => ({...current, isSupported: true, transport: 'storage'}));
        // The last written value is persisted, so a new tab can pick it up directly.
        receive(read(store.getItem(storageKey)));

        return () => {
            postRef.current = null;
            window.removeEventListener('storage', onStorage);
        };
    }, [channel, apply]);

    const set = useCallback((value: BroadcastStateAction<T>) => {
        const next = typeof value === 'function' ? (value as (previous: T) => T)(stateRef.current) : value;
        const stamp = Math.max(Date.now(), stampRef.current + 1);

        apply(next, stamp, 'local');
        postRef.current?.({type: 'set', sender: idRef.current ?? '', stamp, value: next});
    }, [apply]);

    return [state, set, meta];
}
