export interface WindowSize {
    width: number;
    height: number;
}

export interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export interface CounterActions {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    set: (value: number) => void;
}

export interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    error: string | null;
}

export interface LocationState {
    pathname: string;
    search: string;
    hash: string;
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
    play: () => void;
    pause: () => void;
    stop: () => void;
    setVolume: (volume: number) => void;
    setTime: (time: number) => void;
}

export interface AudioState {
    playing: boolean;
    currentTime: number;
    duration: number;
    volume: number;
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
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
}

export interface DropAreaState {
    isOver: boolean;
    files: File[];
}

export interface DropAreaHandlers {
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
}

export interface VideoControls {
    play: () => void;
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
}

export interface CookieOptions {
    path?: string;
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

export interface AsyncControls<T> {
    execute: (...args: any[]) => Promise<T | null>;
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
}

export interface NetworkState {
    online: boolean;
    since?: Date;
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

export interface MousePosition {
    x: number;
    y: number;
}