import * as react from 'react';
import { RefObject } from 'react';

declare function useLocalStorage<T>(key: string, initialValue: T): {
    storedValue: T;
    setValue: (value: T | ((val: T) => T)) => void;
};

declare function useSessionStorage<T>(key: string, initialValue: T): {
    value: T;
    setValue: react.Dispatch<react.SetStateAction<T>>;
    remove: () => void;
};

declare function useDebounce<T>(value: T, delay: number): T;

declare function useThrottle<T>(value: T, delay?: number): T;

declare function useToggle(initialValue?: boolean): {
    value: boolean;
    toggle: () => void;
    setTrue: () => void;
    setFalse: () => void;
};

declare function useCounter(initialValue?: number): {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    set: (value: number) => void;
};

interface WindowSize {
    width: number;
    height: number;
}
interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}
interface CounterActions {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    set: (value: number) => void;
}
interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    error: string | null;
}
interface LocationState {
    pathname: string;
    search: string;
    hash: string;
}
interface MouseWheelEvent {
    deltaX: number;
    deltaY: number;
    deltaZ: number;
}
interface ScrollData {
    x: number;
    y: number;
    direction: 'up' | 'down' | 'left' | 'right' | null;
}
interface AudioControls {
    play: () => void;
    pause: () => void;
    stop: () => void;
    setVolume: (volume: number) => void;
    setTime: (time: number) => void;
}
interface AudioState {
    playing: boolean;
    currentTime: number;
    duration: number;
    volume: number;
}
interface FullscreenControls {
    enter: () => void;
    exit: () => void;
    toggle: () => void;
}
interface DropState {
    isOver: boolean;
    data: any | null;
}
interface DropHandlers {
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
}
interface DropAreaState {
    isOver: boolean;
    files: File[];
}
interface DropAreaHandlers {
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
}
interface VideoControls {
    play: () => void;
    pause: () => void;
    stop: () => void;
    setVolume: (volume: number) => void;
    setTime: (time: number) => void;
    toggleMute: () => void;
}
interface VideoState {
    playing: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    muted: boolean;
}
interface CookieOptions {
    path?: string;
    expires?: Date;
    maxAge?: number;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
}
interface AsyncState<T> {
    loading: boolean;
    error: any;
    data: T | null;
}
interface AsyncControls<T> {
    execute: (...args: any[]) => Promise<T | null>;
    reset: () => void;
}
interface AsyncRetryState<T> {
    loading: boolean;
    error: any;
    data: T | null;
    attempts: number;
}
interface AsyncRetryControls<T> {
    execute: (...args: any[]) => Promise<T | null>;
    reset: () => void;
}
interface EventOptions {
    capture?: boolean;
    passive?: boolean;
}
interface NetworkState {
    online: boolean;
    since?: Date;
}
interface VisibilityState {
    visible: boolean;
    hidden: boolean;
}
interface LongPressOptions {
    delay?: number;
    onStart?: () => void;
    onEnd?: () => void;
}
interface MousePosition {
    x: number;
    y: number;
}

declare function useFetch<T>(url: string): FetchState<T>;

declare function useAsync<T = any>(asyncFunction: (...args: any[]) => Promise<T>, immediate?: boolean): AsyncState<T> & AsyncControls<T>;

declare function useAsyncRetry<T = any>(asyncFunction: (...args: any[]) => Promise<T>, immediate?: boolean, maxRetries?: number, retryDelay?: number): AsyncRetryState<T> & AsyncRetryControls<T>;

declare function useHover<T extends HTMLElement = HTMLElement>(): {
    ref: react.RefObject<T>;
    isHovered: boolean;
};

declare function useClickOutside<T extends HTMLElement = HTMLElement>(ref: RefObject<T>, handler: (event: MouseEvent | TouchEvent) => void): void;

declare function useCopyToClipboard(): {
    isCopied: boolean;
    copyToClipboard: (text: string) => Promise<void>;
};

declare function useInterval(callback: () => void, delay: number | null): void;

declare function useWindowSize(): WindowSize;

declare function useGeolocation(): {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    error: string | null;
};

declare function useHash(): {
    hash: string;
    setHash: (newHash: string) => void;
};

declare function useIdle(timeout?: number): {
    isIdle: boolean;
};

interface IntersectionOptions extends IntersectionObserverInit {
}
declare function useIntersection<T extends HTMLElement = HTMLElement>(options?: IntersectionOptions): {
    ref: RefObject<T>;
    isIntersecting: boolean;
};

declare function useKeyPress(targetKey: string): boolean;

declare function useLocation(): LocationState;

declare function useLockBodyScroll(lock?: boolean): void;

declare function useLongPress(callback: () => void, { delay, onStart, onEnd }?: LongPressOptions): {
    onMouseDown: () => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
    onTouchStart: () => void;
    onTouchEnd: () => void;
};

declare function useMedia(query: string, defaultState?: boolean): {
    matches: boolean;
};

interface MediaDeviceInfoExtended extends MediaDeviceInfo {
}
declare function useMediaDevices(): {
    devices: MediaDeviceInfoExtended[];
};

declare function useMouse<T extends HTMLElement = HTMLElement>(ref?: RefObject<T>): MousePosition;

declare function useMouseWheel<T extends HTMLElement = HTMLElement>(ref?: RefObject<T>): MouseWheelEvent;

declare function useNetworkState(): NetworkState;

declare function usePageLeave(callback: (event?: BeforeUnloadEvent) => void): void;

declare function usePrevious<T>(value: T): T | undefined;

declare function useScroll<T extends HTMLElement = HTMLElement>(ref?: RefObject<T>): ScrollData;

declare function useSearchParam(key: string): {
    value: string | null;
    setValue: (newValue: string | null) => void;
};

declare function useDrop<T extends HTMLElement = HTMLElement>(): {
    handlers: DropHandlers;
    isOver: boolean;
    data: any | null;
    ref: react.RefObject<T>;
};

declare function useDropArea<T extends HTMLElement = HTMLElement>(): {
    handlers: DropAreaHandlers;
    isOver: boolean;
    files: File[];
    ref: react.RefObject<T>;
};

declare function useVideo(src: string): {
    videoRef: react.MutableRefObject<HTMLVideoElement>;
    controls: VideoControls;
    playing: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    muted: boolean;
};

declare function useAudio(src: string): {
    audioRef: react.MutableRefObject<HTMLAudioElement>;
    controls: AudioControls;
    playing: boolean;
    currentTime: number;
    duration: number;
    volume: number;
};

declare function useFullscreen<T extends HTMLElement = HTMLElement>(): {
    ref: react.RefObject<T>;
    isFullscreen: boolean;
    controls: FullscreenControls;
};

declare function useUpdate(): () => void;

declare function useVisibilityChange(): VisibilityState;

declare function useCookie(name: string, initialValue?: string): {
    value: string;
    setValue: (newValue: string, options?: CookieOptions) => void;
    remove: () => void;
};

declare function useEvent<K extends keyof WindowEventMap, T extends HTMLElement | Window | Document = Window>(type: K, listener: (event: WindowEventMap[K]) => void, target?: RefObject<T> | T, options?: EventOptions): void;

export { type AsyncControls, type AsyncRetryControls, type AsyncRetryState, type AsyncState, type AudioControls, type AudioState, type CookieOptions, type CounterActions, type DropAreaHandlers, type DropAreaState, type DropHandlers, type DropState, type EventOptions, type FetchState, type FullscreenControls, type GeolocationState, type LocationState, type LongPressOptions, type MousePosition, type MouseWheelEvent, type NetworkState, type ScrollData, type VideoControls, type VideoState, type VisibilityState, type WindowSize, useAsync, useAsyncRetry, useAudio, useClickOutside, useCookie, useCopyToClipboard, useCounter, useDebounce, useDrop, useDropArea, useEvent, useFetch, useFullscreen, useGeolocation, useHash, useHover, useIdle, useIntersection, useInterval, useKeyPress, useLocalStorage, useLocation, useLockBodyScroll, useLongPress, useMedia, useMediaDevices, useMouse, useMouseWheel, useNetworkState, usePageLeave, usePrevious, useScroll, useSearchParam, useSessionStorage, useThrottle, useToggle, useUpdate, useVideo, useVisibilityChange, useWindowSize };
