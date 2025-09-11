import {useCallback, useEffect, useState} from 'react';

export function useSessionStorage<T>(key: string, initialValue: T) {
    const getValue = (): T => {
        if (typeof window === 'undefined') return initialValue;
        try {
            const stored = window.sessionStorage.getItem(key);
            return stored ? (JSON.parse(stored) as T) : initialValue;
        } catch (error) {
            console.error(`Error reading sessionStorage key "${key}":`, error);
            return initialValue;
        }
    };

    const [value, setValue] = useState<T>(getValue);

    useEffect(() => {
        try {
            window.sessionStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting sessionStorage key "${key}":`, error);
        }
    }, [key, value]);

    const remove = useCallback(() => {
        try {
            window.sessionStorage.removeItem(key);
            setValue(initialValue);
        } catch (error) {
            console.error(`Error removing sessionStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    return {value, setValue, remove};
}
