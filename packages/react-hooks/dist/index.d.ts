import { RefObject } from 'react';

declare function useLocalStorage<T>(key: string, initialValue: T): readonly [T, (value: T | ((val: T) => T)) => void];

declare function useDebounce<T>(value: T, delay: number): T;

declare function useToggle(initialValue?: boolean): readonly [boolean, {
    readonly toggle: () => void;
    readonly setTrue: () => void;
    readonly setFalse: () => void;
}];

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
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    set: (value: number) => void;
}

declare function useCounter(initialValue?: number): [number, CounterActions];

declare function useFetch<T>(url: string): FetchState<T>;

declare function useHover<T extends HTMLElement = HTMLElement>(): [RefObject<T>, boolean];

declare function useClickOutside<T extends HTMLElement = HTMLElement>(ref: RefObject<T>, handler: (event: MouseEvent | TouchEvent) => void): void;

declare function useCopyToClipboard(): [boolean, (text: string) => Promise<void>];

declare function useInterval(callback: () => void, delay: number | null): void;

declare function useWindowSize(): WindowSize;

export { type CounterActions, type FetchState, type WindowSize, useClickOutside, useCopyToClipboard, useCounter, useDebounce, useFetch, useHover, useInterval, useLocalStorage, useToggle, useWindowSize };
