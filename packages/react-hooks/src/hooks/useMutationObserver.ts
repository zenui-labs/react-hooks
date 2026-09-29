import {RefObject, useCallback, useEffect, useRef, useState} from 'react';
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';
import {useLatest} from './useLatest';

/** A ref to the node to watch, or the node itself (for example one stored from a callback ref). */
export type MutationObserverTarget<T extends Node = Node> = RefObject<T | null> | T | null | undefined;

export interface MutationObserverHookResult {
    /** True while an observer is attached to a node. */
    isObserving: boolean;
    /** Empty the observer's queue and return records that were not delivered yet. */
    takeRecords: () => MutationRecord[];
}

const DEFAULT_OPTIONS: MutationObserverInit = {childList: true, subtree: true};

function resolveTarget<T extends Node>(target: MutationObserverTarget<T>): T | null {
    if (!target) return null;
    if ('current' in target) return target.current ?? null;
    return target;
}

// Options are compared by value, so an inline object literal does not re-create the observer.
function optionsKey(options: MutationObserverInit) {
    const entries = Object.keys(options)
        .sort()
        .map((key) => [key, options[key as keyof MutationObserverInit]] as const)
        .filter(([, value]) => value !== undefined);
    return JSON.stringify(entries);
}

/**
 * Watch a DOM node for changes with `MutationObserver`. The callback always sees the latest props.
 * @example
 * const listRef = useRef<HTMLUListElement>(null);
 * useMutationObserver(listRef, (records) => console.log(records.length, 'changes'));
 * return <ul ref={listRef}>{items}</ul>;
 */
export function useMutationObserver<T extends Node = Node>(
    target: MutationObserverTarget<T>,
    callback: MutationCallback,
    options: MutationObserverInit = DEFAULT_OPTIONS
): MutationObserverHookResult {
    const callbackRef = useLatest(callback);
    const observerRef = useRef<MutationObserver | null>(null);
    const [node, setNode] = useState<T | null>(null);
    const [isObserving, setIsObserving] = useState(false);
    const key = optionsKey(options);

    // Refs do not trigger renders, so re-resolve the target after every commit.
    useIsomorphicLayoutEffect(() => {
        setNode(resolveTarget(target));
    });

    useEffect(() => {
        if (!node || typeof MutationObserver === 'undefined') return;

        const init = Object.fromEntries(JSON.parse(key) as [string, unknown][]) as MutationObserverInit;
        const observer = new MutationObserver((records, instance) => callbackRef.current(records, instance));
        observer.observe(node, init);
        observerRef.current = observer;
        setIsObserving(true);

        return () => {
            observer.disconnect();
            observerRef.current = null;
            setIsObserving(false);
        };
    }, [node, key, callbackRef]);

    const takeRecords = useCallback(() => observerRef.current?.takeRecords() ?? [], []);

    return {isObserving, takeRecords};
}
