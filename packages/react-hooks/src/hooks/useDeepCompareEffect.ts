import {useEffect, useRef} from 'react';
import type {DependencyList, EffectCallback} from 'react';

function isPlainObject(value: object): boolean {
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}

/**
 * Structural equality for plain objects, arrays, Date, RegExp, Map and Set.
 * Primitives use `Object.is`, so `NaN` equals `NaN`. Other objects (class instances,
 * functions, DOM nodes) are compared by reference.
 */
function deepEqual(a: unknown, b: unknown): boolean {
    if (Object.is(a, b)) return true;
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
    if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;

    if (a instanceof Date) return a.getTime() === (b as Date).getTime();
    if (a instanceof RegExp) return a.source === (b as RegExp).source && a.flags === (b as RegExp).flags;

    if (Array.isArray(a)) {
        const other = b as unknown[];
        if (a.length !== other.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], other[i])) return false;
        }
        return true;
    }

    if (a instanceof Map) {
        const other = b as Map<unknown, unknown>;
        if (a.size !== other.size) return false;
        for (const [key, value] of a) {
            if (!other.has(key) || !deepEqual(value, other.get(key))) return false;
        }
        return true;
    }

    if (a instanceof Set) {
        const other = b as Set<unknown>;
        if (a.size !== other.size) return false;
        for (const value of a) {
            if (other.has(value)) continue;
            // Object members need a structural match somewhere in the other set.
            let found = false;
            for (const candidate of other) {
                if (deepEqual(value, candidate)) {
                    found = true;
                    break;
                }
            }
            if (!found) return false;
        }
        return true;
    }

    if (!isPlainObject(a)) return false;

    const objA = a as Record<string, unknown>;
    const objB = b as Record<string, unknown>;
    const keys = Object.keys(objA);
    if (keys.length !== Object.keys(objB).length) return false;
    for (const key of keys) {
        if (!Object.prototype.hasOwnProperty.call(objB, key) || !deepEqual(objA[key], objB[key])) return false;
    }
    return true;
}

/**
 * `useEffect` that compares dependencies by value instead of by reference.
 * Use it when a dependency is an object or array that is rebuilt on every render.
 *
 * @example
 * useDeepCompareEffect(() => {
 *     fetchResults(filters);
 * }, [filters]); // runs only when the contents of filters change
 */
export function useDeepCompareEffect(effect: EffectCallback, deps: DependencyList): void {
    const depsRef = useRef<DependencyList | null>(null);
    const signalRef = useRef(0);

    if (depsRef.current === null || !deepEqual(depsRef.current, deps)) {
        depsRef.current = deps;
        signalRef.current += 1;
    }

    useEffect(effect, [signalRef.current]);
}
