import {useEffect} from 'react';
import {useLatest} from './useLatest';

/**
 * Call `callback` every `delay` milliseconds. Pass `null` to pause.
 * The latest callback is always used, so it can read fresh state without resetting the timer.
 * @example
 * const [count, setCount] = useState(0);
 * useInterval(() => setCount(count + 1), running ? 1000 : null);
 */
export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useLatest(callback);

    useEffect(() => {
        if (delay === null || delay === undefined || !Number.isFinite(delay) || delay < 0) return;

        const id = setInterval(() => savedCallback.current(), delay);

        return () => clearInterval(id);
    }, [delay, savedCallback]);
}
