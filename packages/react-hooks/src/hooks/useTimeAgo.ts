import {useEffect, useMemo, useState} from 'react';

export type TimeAgoUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export interface TimeAgoOptions {
    /** BCP 47 locale(s) passed to `Intl.RelativeTimeFormat`. Defaults to the runtime locale. */
    locale?: string | string[];
    /** Fixed refresh interval in milliseconds. By default the hook wakes exactly when the text would change. */
    updateInterval?: number;
    /** `'auto'` allows phrases like "yesterday" and "now". Defaults to `'auto'`. */
    numeric?: 'always' | 'auto';
    /** Defaults to `'long'`. */
    style?: 'long' | 'short' | 'narrow';
}

export interface TimeAgoResult {
    /** Formatted text, e.g. "3 minutes ago". Empty for an invalid date. */
    text: string;
    /** Signed amount in `unit`: negative in the past, positive in the future. */
    value: number;
    unit: TimeAgoUnit;
    /** True when the date is in the future. */
    isFuture: boolean;
}

export type TimeAgoInput = Date | number | string;

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30.44 * DAY;
const YEAR = 365.25 * DAY;

const UNITS: Array<[TimeAgoUnit, number, number]> = [
    // unit, size in ms, upper bound in ms
    ['second', SECOND, MINUTE],
    ['minute', MINUTE, HOUR],
    ['hour', HOUR, DAY],
    ['day', DAY, WEEK],
    ['week', WEEK, MONTH],
    ['month', MONTH, YEAR],
    ['year', YEAR, Infinity],
];

function toTime(input: TimeAgoInput) {
    return input instanceof Date ? input.getTime() : new Date(input).getTime();
}

function measure(time: number, at: number) {
    const diff = time - at;
    const abs = Math.abs(diff);
    const [unit, size] = UNITS.find(([, , limit]) => abs < limit) ?? UNITS[UNITS.length - 1];
    const amount = Math.floor(abs / size);
    // Milliseconds until `amount` changes: grows for past dates, shrinks for future ones.
    const untilChange = diff <= 0 ? (amount + 1) * size - abs : abs - amount * size + 1;
    return {unit, value: diff < 0 ? -amount : amount, untilChange, isFuture: diff > 0};
}

/**
 * Format a date as relative time ("3 minutes ago", "in 2 days") that keeps itself up to date.
 * Uses `Intl.RelativeTimeFormat` and schedules the next update for the moment the text changes.
 * @example
 * const {text} = useTimeAgo(comment.createdAt);
 * return <time dateTime={comment.createdAt}>{text}</time>;
 */
export function useTimeAgo(date: TimeAgoInput, options: TimeAgoOptions = {}): TimeAgoResult {
    const {locale, updateInterval, numeric = 'auto', style = 'long'} = options;
    const time = toTime(date);
    const [now, setNow] = useState(() => Date.now());

    const localeKey = Array.isArray(locale) ? locale.join(',') : locale ?? '';
    const formatter = useMemo(
        () => new Intl.RelativeTimeFormat(localeKey ? localeKey.split(',') : undefined, {numeric, style}),
        [localeKey, numeric, style]
    );

    useEffect(() => {
        if (Number.isNaN(time)) return;
        let timer: ReturnType<typeof setTimeout>;

        const schedule = () => {
            const current = Date.now();
            setNow(current);
            const wait = updateInterval ?? measure(time, current).untilChange;
            // Clamp: at least 250ms to avoid hot loops, at most an hour to stay within timer limits.
            timer = setTimeout(schedule, Math.min(Math.max(wait, 250), HOUR));
        };

        schedule();
        return () => clearTimeout(timer);
    }, [time, updateInterval]);

    if (Number.isNaN(time)) return {text: '', value: 0, unit: 'second', isFuture: false};

    const {unit, value, isFuture} = measure(time, now);
    // Signed zero keeps "now" rather than "in 0 seconds".
    return {text: formatter.format(value === 0 ? -0 : value, unit), value, unit, isFuture};
}
