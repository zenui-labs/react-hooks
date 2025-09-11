import {useCallback, useEffect, useRef, useState} from 'react';
import {AsyncRetryControls, AsyncRetryState} from "../types";

export function useAsyncRetry<T = any>(
    asyncFunction: (...args: any[]) => Promise<T>,
    immediate = true,
    maxRetries = 3,
    retryDelay = 1000
) {
    const [state, setState] = useState<AsyncRetryState<T>>({
        loading: immediate,
        error: null,
        data: null,
        attempts: 0,
    });

    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const execute = useCallback(async (...args: any[]): Promise<T | null> => {
        let attempt = 0;
        setState({loading: true, error: null, data: null, attempts: attempt});

        while (attempt < maxRetries) {
            try {
                const data = await asyncFunction(...args);
                if (isMounted.current) {
                    setState({loading: false, error: null, data, attempts: attempt + 1});
                }
                return data;
            } catch (error) {
                attempt += 1;
                if (attempt >= maxRetries) {
                    if (isMounted.current) {
                        setState({loading: false, error, data: null, attempts: attempt});
                    }
                    return null;
                }
                await new Promise(res => setTimeout(res, retryDelay));
            }
        }

        return null;
    }, [asyncFunction, maxRetries, retryDelay]);

    const reset = useCallback(() => {
        if (isMounted.current) {
            setState({loading: false, error: null, data: null, attempts: 0});
        }
    }, []);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return {...state, execute, reset} as AsyncRetryState<T> & AsyncRetryControls<T>;
}
