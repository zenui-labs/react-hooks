import {useCallback, useEffect, useRef, useState} from 'react';
import {LongPressOptions} from "../types";

export function useLongPress(
    callback: () => void,
    {delay = 500, onStart, onEnd}: LongPressOptions = {}
) {
    const [longPressTriggered, setLongPressTriggered] = useState(false);
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const start = useCallback(() => {
        onStart?.();
        timeout.current = setTimeout(() => {
            callback();
            setLongPressTriggered(true);
        }, delay);
    }, [callback, delay, onStart]);

    const clear = useCallback(() => {
        if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = null;
        }
        if (longPressTriggered) {
            onEnd?.();
            setLongPressTriggered(false);
        }
    }, [longPressTriggered, onEnd]);

    useEffect(() => {
        return () => clear();
    }, [clear]);

    const bind = {
        onMouseDown: start,
        onMouseUp: clear,
        onMouseLeave: clear,
        onTouchStart: start,
        onTouchEnd: clear,
    };

    return bind;
}
