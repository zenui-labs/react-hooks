import {useCallback, useEffect, useRef, useState} from 'react';
import {isBrowser} from '../utils/env';
import {useLatest} from './useLatest';

export type WebSocketStatus = 'idle' | 'connecting' | 'open' | 'closing' | 'closed';

export type WebSocketSendData = string | ArrayBufferLike | Blob | ArrayBufferView;

export interface WebSocketReconnectOptions {
    /** Maximum reconnect attempts after an unexpected close. Defaults to 5. */
    attempts?: number;
    /** Milliseconds before an attempt, or a function of the attempt number (1-based). Defaults to exponential backoff capped at 30s. */
    delay?: number | ((attempt: number) => number);
}

export interface WebSocketHeartbeatOptions {
    /** Payload to send on every beat. Defaults to `'ping'`. */
    message?: WebSocketSendData | (() => WebSocketSendData);
    /** Milliseconds between beats. Defaults to 30000. */
    interval?: number;
}

export interface WebSocketOptions<T> {
    protocols?: string | string[];
    /** Reconnect after the connection drops unexpectedly. Defaults to false. */
    reconnect?: boolean | WebSocketReconnectOptions;
    /** Send a keep-alive message while the socket is open. */
    heartbeat?: WebSocketHeartbeatOptions;
    /** Transform raw `event.data` before it is stored and passed to `onMessage`. */
    parse?: (data: unknown) => T;
    onMessage?: (message: T, event: MessageEvent) => void;
    onOpen?: (event: Event) => void;
    onClose?: (event: CloseEvent) => void;
    onError?: (event: Event) => void;
}

export interface WebSocketResult<T> {
    status: WebSocketStatus;
    /** Most recent message, after `parse`. `null` until the first message arrives. */
    lastMessage: T | null;
    /** Send now when open, queue while connecting or waiting to reconnect. Returns false when the message was dropped. */
    send: (data: WebSocketSendData) => boolean;
    /** Close the socket and stop reconnecting. */
    close: (code?: number, reason?: string) => void;
    /** Drop the current socket and connect again with a fresh attempt counter. */
    reconnect: () => void;
    /** Current reconnect attempt, 0 while connected or before any drop. */
    reconnectAttempt: number;
    /** The underlying socket, for anything the hook does not cover. */
    getSocket: () => WebSocket | null;
    isSupported: boolean;
}

const CONNECTING = 0;
const OPEN = 1;

function resolveReconnect(option: WebSocketOptions<unknown>['reconnect']) {
    if (!option) return null;
    const config = option === true ? {} : option;
    return {
        attempts: config.attempts ?? 5,
        delay: config.delay ?? ((attempt: number) => Math.min(1000 * 2 ** (attempt - 1), 30000)),
    };
}

/**
 * Connect to a WebSocket with status tracking, an outgoing queue, reconnect with backoff and heartbeats.
 * Pass `null` as the url to stay disconnected.
 * @example
 * const {status, lastMessage, send} = useWebSocket('wss://echo.websocket.org', {reconnect: true});
 * send('hello');
 */
export function useWebSocket<T = unknown>(url: string | null, options: WebSocketOptions<T> = {}): WebSocketResult<T> {
    // Assume support on the server so the first client render matches.
    const isSupported = !isBrowser || typeof WebSocket !== 'undefined';
    const [status, setStatus] = useState<WebSocketStatus>(url === null ? 'idle' : 'connecting');
    const [lastMessage, setLastMessage] = useState<T | null>(null);
    const [reconnectAttempt, setReconnectAttempt] = useState(0);
    const [generation, setGeneration] = useState(0);

    const optionsRef = useLatest(options);
    const socketRef = useRef<WebSocket | null>(null);
    const queueRef = useRef<WebSocketSendData[]>([]);
    const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const manualCloseRef = useRef(false);

    const protocols = options.protocols;
    const protocolsKey = Array.isArray(protocols) ? protocols.join(',') : protocols ?? '';

    useEffect(() => {
        if (url === null || !isSupported) {
            setStatus('idle');
            return;
        }

        let disposed = false;
        let attempt = 0;
        let heartbeat: ReturnType<typeof setInterval> | null = null;
        manualCloseRef.current = false;
        queueRef.current = [];
        setReconnectAttempt(0);

        const stopHeartbeat = () => {
            if (heartbeat !== null) clearInterval(heartbeat);
            heartbeat = null;
        };

        const scheduleRetry = () => {
            const config = resolveReconnect(optionsRef.current.reconnect);
            if (!config || attempt >= config.attempts) {
                queueRef.current = [];
                return;
            }
            attempt += 1;
            setReconnectAttempt(attempt);
            const wait = typeof config.delay === 'function' ? config.delay(attempt) : config.delay;
            retryTimerRef.current = setTimeout(connect, Math.max(0, wait));
        };

        function connect() {
            retryTimerRef.current = null;
            if (disposed || url === null) return;
            setStatus('connecting');

            let socket: WebSocket;
            try {
                socket = new WebSocket(url, protocolsKey ? protocolsKey.split(',') : undefined);
            } catch {
                optionsRef.current.onError?.(new Event('error'));
                setStatus('closed');
                scheduleRetry();
                return;
            }
            socketRef.current = socket;

            socket.onopen = (event) => {
                if (disposed) return;
                attempt = 0;
                setReconnectAttempt(0);
                setStatus('open');

                const queued = queueRef.current;
                queueRef.current = [];
                queued.forEach((data) => socket.send(data));

                const beat = optionsRef.current.heartbeat;
                if (beat) {
                    heartbeat = setInterval(() => {
                        if (socket.readyState !== OPEN) return;
                        const message = optionsRef.current.heartbeat?.message ?? 'ping';
                        socket.send(typeof message === 'function' ? message() : message);
                    }, beat.interval ?? 30000);
                }
                optionsRef.current.onOpen?.(event);
            };

            socket.onmessage = (event: MessageEvent) => {
                if (disposed) return;
                const parse = optionsRef.current.parse;
                const message = parse ? parse(event.data) : (event.data as T);
                setLastMessage(() => message);
                optionsRef.current.onMessage?.(message, event);
            };

            socket.onerror = (event) => {
                if (!disposed) optionsRef.current.onError?.(event);
            };

            socket.onclose = (event) => {
                stopHeartbeat();
                if (socketRef.current === socket) socketRef.current = null;
                if (disposed) return;
                setStatus('closed');
                optionsRef.current.onClose?.(event);
                if (!manualCloseRef.current) scheduleRetry();
            };
        }

        connect();

        return () => {
            disposed = true;
            stopHeartbeat();
            if (retryTimerRef.current !== null) clearTimeout(retryTimerRef.current);
            retryTimerRef.current = null;
            const socket = socketRef.current;
            socketRef.current = null;
            if (socket) {
                socket.onopen = socket.onmessage = socket.onerror = socket.onclose = null;
                if (socket.readyState === CONNECTING || socket.readyState === OPEN) socket.close(1000);
            }
        };
    }, [url, protocolsKey, generation, isSupported, optionsRef]);

    const send = useCallback((data: WebSocketSendData) => {
        const socket = socketRef.current;
        if (socket && socket.readyState === OPEN) {
            socket.send(data);
            return true;
        }
        const waiting = (socket && socket.readyState === CONNECTING) || retryTimerRef.current !== null;
        if (waiting && !manualCloseRef.current) {
            queueRef.current.push(data);
            return true;
        }
        return false;
    }, []);

    const close = useCallback((code?: number, reason?: string) => {
        manualCloseRef.current = true;
        queueRef.current = [];
        if (retryTimerRef.current !== null) {
            clearTimeout(retryTimerRef.current);
            retryTimerRef.current = null;
            setReconnectAttempt(0);
            setStatus('closed');
        }
        const socket = socketRef.current;
        if (socket && (socket.readyState === CONNECTING || socket.readyState === OPEN)) {
            setStatus('closing');
            socket.close(code ?? 1000, reason);
        }
    }, []);

    const reconnect = useCallback(() => setGeneration((value) => value + 1), []);

    const getSocket = useCallback(() => socketRef.current, []);

    return {status, lastMessage, send, close, reconnect, reconnectAttempt, getSocket, isSupported};
}
