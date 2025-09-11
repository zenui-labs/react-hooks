import {useCallback, useEffect, useRef, useState} from 'react';
import {AsyncControls, AsyncState} from "../types";

export function useAsync<T = any>(asyncFunction: (...args: any[]) => Promise<T>, immediate = true) {
    const [state, setState] = useState<AsyncState<T>>({
        loading: immediate,
        error: null,
        data: null,
    });

    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const execute = useCallback(async (...args: any[]): Promise<T | null> => {
        setState({loading: true, error: null, data: null});
        try {
            const data = await asyncFunction(...args);
            if (isMounted.current) {
                setState({loading: false, error: null, data});
            }
            return data;
        } catch (error) {
            if (isMounted.current) {
                setState({loading: false, error, data: null});
            }
            return null;
        }
    }, [asyncFunction]);

    const reset = useCallback(() => {
        if (isMounted.current) {
            setState({loading: false, error: null, data: null});
        }
    }, []);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return {...state, execute, reset} as AsyncState<T> & AsyncControls<T>;
}
