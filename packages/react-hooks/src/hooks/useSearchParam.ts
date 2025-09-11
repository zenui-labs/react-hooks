import {useCallback, useEffect, useState} from 'react';

export function useSearchParam(key: string) {
    const getValue = () => {
        return new URLSearchParams(window.location.search).get(key);
    };

    const [value, setValue] = useState<string | null>(getValue);

    useEffect(() => {
        const onChange = () => setValue(getValue());
        window.addEventListener('popstate', onChange);
        window.addEventListener('pushstate', onChange as EventListener);
        window.addEventListener('replacestate', onChange as EventListener);

        return () => {
            window.removeEventListener('popstate', onChange);
            window.removeEventListener('pushstate', onChange as EventListener);
            window.removeEventListener('replacestate', onChange as EventListener);
        };
    }, [key]);

    const setSearchParam = useCallback((newValue: string | null) => {
        const url = new URL(window.location.href);

        if (newValue === null) {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, newValue);
        }

        window.history.pushState({}, '', url.toString());
        setValue(newValue);
    }, [key]);

    return {value, setValue: setSearchParam};
}
