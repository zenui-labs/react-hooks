import {useCallback, useEffect, useRef, useState} from 'react';
import {AsyncControls, AsyncState} from "../types";

export function useAsync<T = any>(
    asyncFunction: (...args: any[]) => Promise<T>,
    immediate = true
) {
    const [state, setState] = useState<AsyncState<T>>({
        loading: immediate,
        error: null,
        data: null,
    });

    const isMountedRef = useRef(false);
    const asyncFunctionRef = useRef(asyncFunction);

    asyncFunctionRef.current = asyncFunction;

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const execute = useCallback(async (...args: any[]): Promise<T | null> => {
        setState({loading: true, error: null, data: null});

        try {
            const result = await asyncFunctionRef.current(...args);
            setState({loading: false, error: null, data: result});

            return result;
        } catch (error: any) {
            setState({loading: false, error, data: null});

            return null;
        }
    }, []);

    const reset = useCallback(() => {
        setState({loading: false, error: null, data: null});
    }, []);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, []);

    return {
        ...state,
        execute,
        reset
    } as AsyncState<T> & AsyncControls<T>;
}