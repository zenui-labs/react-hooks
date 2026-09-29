export interface WindowSize {
    width: number;
    height: number;
}

export interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export interface FetchResult<T> extends FetchState<T> {
    /** Run the request again. Aborts a request that is still in flight. */
    refetch: () => void;
}

export interface LocalStorageResult<T> {
    storedValue: T;
    setValue: (value: T | ((prev: T) => T)) => void;
    remove: () => void;
}

export interface SessionStorageResult<T> {
    value: T;
    setValue: (value: T | ((prev: T) => T)) => void;
    remove: () => void;
}

export interface ToggleResult {
    value: boolean;
    toggle: () => void;
    setTrue: () => void;
    setFalse: () => void;
    set: (value: boolean) => void;
    reset: () => void;
}

export interface CounterActions {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    set: (value: number) => void;
}

export interface CounterOptions {
    /** Lowest allowed value. */
    min?: number;
    /** Highest allowed value. */
    max?: number;
    /** Amount added or removed by increment and decrement. Defaults to 1. */
    step?: number;
}

export interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    error: string | null;
    /** True until the first position or error arrives. */
    loading: boolean;
    /** False when the browser has no Geolocation API. */
    isSupported: boolean;
    /** Time the last position was captured, in ms since the epoch. */
    timestamp: number | null;
}

export interface GeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
}

export interface LocationState {
    pathname: string;
    search: string;
    hash: string;
}

export interface SearchParamOptions {
    /** Use `history.replaceState` instead of `pushState`. */
    replace?: boolean;
}

export interface IntersectionOptions extends IntersectionObserverInit {
    /** Stop observing after the element first becomes visible. */
    once?: boolean;
}

export interface MouseWheelEvent {
    deltaX: number;
    deltaY: number;
    deltaZ: number;
}

export interface ScrollData {
    x: number;
    y: number;
    direction: 'up' | 'down' | 'left' | 'right' | null;
}

export interface AudioControls {
    play: () => Promise<void>;
    pause: () => void;
    stop: () => void;
    setVolume: (volume: number) => void;
    setTime: (time: number) => void;
    toggleMute: () => void;
}

export interface AudioState {
    playing: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    muted: boolean;
    ended: boolean;
}

export interface FullscreenControls {
    enter: () => void;
    exit: () => void;
    toggle: () => void;
}

export interface DropState {
    isOver: boolean;
    data: any | null;
}

export interface DropHandlers {
    onDragEnter: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
}

export interface DropResult<T extends HTMLElement = HTMLElement> extends DropState {
    ref: React.RefObject<T | null>;
    handlers: DropHandlers;
}

export interface DropAreaState {
    isOver: boolean;
    files: File[];
}

export interface DropAreaHandlers {
    onDragEnter: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
}

export interface DropAreaOptions {
    /** MIME types or extensions to accept, e.g. `['image/*', '.pdf']`. Accepts everything when omitted. */
    accept?: string[];
    /** Keep every dropped file. When false only the first accepted file is kept. Defaults to true. */
    multiple?: boolean;
}

export interface DropAreaResult<T extends HTMLElement = HTMLElement> extends DropAreaState {
    ref: React.RefObject<T | null>;
    /** Files from the last drop that did not match `accept`. */
    rejected: File[];
    handlers: DropAreaHandlers;
    /** Empty `files` and `rejected`. */
    clear: () => void;
}

export interface VideoControls {
    play: () => Promise<void>;
    pause: () => void;
    stop: () => void;
    setVolume: (volume: number) => void;
    setTime: (time: number) => void;
    toggleMute: () => void;
}

export interface VideoState {
    playing: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    muted: boolean;
    ended: boolean;
}

export interface CookieOptions {
    path?: string;
    domain?: string;
    expires?: Date;
    maxAge?: number;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
}

export interface AsyncState<T> {
    loading: boolean;
    error: any;
    data: T | null;
}

export interface AsyncControls<T, Args extends unknown[] = any[]> {
    execute: (...args: Args) => Promise<T | null>;
    reset: () => void;
}

export interface AsyncRetryState<T> {
    loading: boolean;
    error: any;
    data: T | null;
    attempts: number;
}

export interface AsyncRetryControls<T> {
    execute: (...args: any[]) => Promise<T | null>;
    reset: () => void;
}

export interface EventOptions {
    capture?: boolean;
    passive?: boolean;
    once?: boolean;
}

export interface NetworkState {
    online: boolean;
    /** When `online` last changed (or when the hook mounted). */
    since?: Date;
    /** Connection details from the Network Information API. Undefined where unsupported. */
    effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
    /** Estimated bandwidth in megabits per second. */
    downlink?: number;
    /** Estimated round-trip time in milliseconds. */
    rtt?: number;
    /** True when the user asked the browser to reduce data usage. */
    saveData?: boolean;
}

export interface VisibilityState {
    visible: boolean;
    hidden: boolean;
}

export interface LongPressOptions {
    delay?: number;
    onStart?: () => void;
    onEnd?: () => void;
}

export interface LongPressHandlers {
    onMouseDown: (event?: React.MouseEvent) => void;
    onMouseUp: (event?: React.MouseEvent) => void;
    onMouseLeave: (event?: React.MouseEvent) => void;
    onTouchStart: (event?: React.TouchEvent) => void;
    onTouchEnd: (event?: React.TouchEvent) => void;
    onTouchCancel: (event?: React.TouchEvent) => void;
    onContextMenu: (event?: React.MouseEvent) => void;
}

/** A callback ref that also exposes the attached element as `current`. */
export type HoverRef<T extends HTMLElement = HTMLElement> = ((node: T | null) => void) & {
    readonly current: T | null;
};

export interface HoverResult<T extends HTMLElement = HTMLElement> {
    ref: HoverRef<T>;
    isHovered: boolean;
}

export interface MousePosition {
    x: number;
    y: number;
}