import {useCallback, useEffect, useRef, useState} from 'react';
import {isBrowser} from '../utils/env';
import {useLatest} from './useLatest';

export type EventSourceStatus = 'idle' | 'connecting' | 'open' | 'closed';

/** The subset of the `EventSource` interface the hook relies on. */
export interface EventSourceLike {
    readonly readyState: number;
    close(): void;
    addEventListener(type: string, listener: (event: Event) => void): void;
    removeEventListener(type: string, listener: (event: Event) => void): void;
}

export type EventSourceConstructor = new (url: string, init?: EventSourceInit) => EventSourceLike;

export interface EventSourceMessage<T> {
    /** Event name: `'message'` for unnamed events, otherwise the `event:` field. */
    type: string;
    data: T;
    /** The `id:` field, or `null` when the server did not send one. */
    id: string | null;
}

export interface EventSourceOptions<T> {
    /** Named events to listen for in addition to `'message'`. */
    events?: string[];
    withCredentials?: boolean;
    /** Transform the raw string payload, e.g. `JSON.parse`. */
    parse?: (data: string) => T;
    onMessage?: (message: EventSourceMessage<T>) => void;
    onOpen?: (event: Event) => void;
    onError?: (event: Event) => void;
    /** Constructor to use instead of the global `EventSource`. Useful for tests, mocks and polyfills. */
    eventSourceClass?: EventSourceConstructor;
}

export interface EventSourceResult<T> {
    status: EventSourceStatus;
    lastEvent: EventSourceMessage<T> | null;
    /** The last error event. Cleared when the stream opens again. */
    error: Event | null;
    /** Close the stream. The browser stops reconnecting. */
    close: () => void;
    /** Close the current stream and open a new one. */
    reconnect: () => void;
    isSupported: boolean;
}

const CLOSED = 2;

/**
 * Subscribe to a Server-Sent Events stream and keep the latest event in state.
 * The browser reconnects on its own after network errors; `status` follows along.
 * @example
 * const {status, lastEvent} = useEventSource('/api/stream', {events: ['price'], parse: JSON.parse});
 * return <p>{status}: {lastEvent?.data.value}</p>;
 */
export function useEventSource<T = string>(url: string | null, options: EventSourceOptions<T> = {}): EventSourceResult<T> {
    const Source = options.eventSourceClass;
    const isSupported = !isBrowser || Boolean(Source) || typeof EventSource !== 'undefined';
    const [status, setStatus] = useState<EventSourceStatus>(url === null ? 'idle' : 'connecting');
    const [lastEvent, setLastEvent] = useState<EventSourceMessage<T> | null>(null);
    const [error, setError] = useState<Event | null>(null);
    const [generation, setGeneration] = useState(0);

    const optionsRef = useLatest(options);
    const sourceRef = useRef<EventSourceLike | null>(null);

    const eventsKey = (options.events ?? []).join('\n');
    const withCredentials = Boolean(options.withCredentials);

    useEffect(() => {
        const Ctor: EventSourceConstructor | undefined =
            Source ?? (typeof EventSource !== 'undefined' ? EventSource : undefined);
        if (url === null || !Ctor) {
            setStatus('idle');
            return;
        }

        const source = new Ctor(url, {withCredentials});
        sourceRef.current = source;
        setStatus('connecting');

        const handleOpen = (event: Event) => {
            setStatus('open');
            setError(null);
            optionsRef.current.onOpen?.(event);
        };

        const handleError = (event: Event) => {
            setError(event);
            setStatus(source.readyState === CLOSED ? 'closed' : 'connecting');
            optionsRef.current.onError?.(event);
        };

        const handleMessage = (event: Event) => {
            const {data, lastEventId} = event as MessageEvent<string>;
            const parse = optionsRef.current.parse;
            const message: EventSourceMessage<T> = {
                type: event.type,
                data: parse ? parse(data) : (data as unknown as T),
                id: lastEventId ? lastEventId : null,
            };
            setLastEvent(message);
            optionsRef.current.onMessage?.(message);
        };

        const types = ['message', ...(eventsKey ? eventsKey.split('\n') : [])];
        source.addEventListener('open', handleOpen);
        source.addEventListener('error', handleError);
        types.forEach((type) => source.addEventListener(type, handleMessage));

        return () => {
            source.removeEventListener('open', handleOpen);
            source.removeEventListener('error', handleError);
            types.forEach((type) => source.removeEventListener(type, handleMessage));
            source.close();
            if (sourceRef.current === source) sourceRef.current = null;
        };
    }, [url, eventsKey, withCredentials, Source, generation, optionsRef]);

    const close = useCallback(() => {
        const source = sourceRef.current;
        if (!source) return;
        source.close();
        setStatus('closed');
    }, []);

    const reconnect = useCallback(() => setGeneration((value) => value + 1), []);

    return {status, lastEvent, error, close, reconnect, isSupported};
}
