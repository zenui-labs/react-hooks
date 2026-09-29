'use client'

import React, {useRef, useState} from 'react';
import {usePolling} from '@zenuilabs/react-hooks';
import {Button, Led, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

type Attempt = { ok: boolean; value?: number };

const WIDTH = 320;
const HEIGHT = 80;

function Sparkline({values}: { values: number[] }) {
    if (values.length < 2) {
        return <div className="flex h-20 items-center justify-center font-mono text-xs text-ink-3">Collecting samples...</div>;
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const step = WIDTH / (values.length - 1);
    const points = values.map((v, i) => `${(i * step).toFixed(1)},${(HEIGHT - 6 - ((v - min) / span) * (HEIGHT - 12)).toFixed(1)}`);
    const [lastX, lastY] = points[points.length - 1].split(',');
    return (
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-20 w-full text-accent" preserveAspectRatio="none" aria-hidden>
            <polyline points={points.join(' ')} fill="none" stroke="currentColor" strokeWidth={2} vectorEffect="non-scaling-stroke"/>
            <circle cx={lastX} cy={lastY} r={3.5} fill="currentColor"/>
        </svg>
    );
}

export default function UsePollingDemo() {
    const [failing, setFailing] = useState(false);
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const failingRef = useRef(failing);
    failingRef.current = failing;
    const level = useRef(50);

    const record = (attempt: Attempt) => setAttempts((prev) => [...prev, attempt].slice(-40));

    // A fake metrics endpoint: 250-600ms of latency, then a reading or an error.
    const fetchLoad = (signal: AbortSignal) =>
        new Promise<number>((resolve, reject) => {
            const timer = setTimeout(() => {
                if (failingRef.current) return reject(new Error('503 Service Unavailable'));
                level.current = Math.min(100, Math.max(0, level.current + (Math.random() - 0.5) * 18));
                resolve(Math.round(level.current));
            }, 250 + Math.random() * 350);
            signal.addEventListener('abort', () => clearTimeout(timer));
        });

    const {data, error, isPolling, isPaused, isFetching, lastUpdated, errorCount, nextDelay, start, stop, pollNow} =
        usePolling(fetchLoad, {
            interval: 1000,
            backoff: {factor: 2, max: 16000},
            onSuccess: (value) => record({ok: true, value}),
            onError: () => record({ok: false}),
        });

    const values = attempts.filter((a) => a.ok).map((a) => a.value as number);

    return (
        <Stage>
            <StageHeader
                title="Server load monitor"
                hint="Polls a fake endpoint every second. Turn on failures to watch the delay double after each error, then recover on the next success. Switch tabs and polling pauses."
            />

            <Row>
                <Button onClick={isPolling ? stop : start}>{isPolling ? 'Stop' : 'Start'}</Button>
                <Button variant="secondary" onClick={() => void pollNow()}>Poll now</Button>
                <Button variant={failing ? 'danger' : 'secondary'} onClick={() => setFailing((on) => !on)}>
                    {failing ? 'Failures on' : 'Simulate failures'}
                </Button>
                <span className="ml-auto">
                    <Led on={isFetching} tone={error ? 'danger' : undefined} label={isPaused ? 'Paused' : isFetching ? 'Fetching' : 'Waiting'}/>
                </span>
            </Row>

            <div className="mt-5 rounded-xl border border-line bg-paper/70 p-4">
                <div className="mb-2 flex items-baseline justify-between font-mono text-xs text-ink-3">
                    <span>load %</span>
                    <span className="text-2xl text-ink tabular-nums">{data ?? '--'}</span>
                </div>
                <Sparkline values={values}/>
                <div className="mt-3 flex flex-wrap gap-1" aria-label="Recent attempts">
                    {attempts.map((a, i) => (
                        <span key={i} className={`h-2 w-2 rounded-full bg-current ${a.ok ? 'text-ok' : 'text-danger'}`}/>
                    ))}
                </div>
            </div>

            <ReadoutGrid cols={4} className="mt-4">
                <Readout label="isPolling" value={String(isPolling)} live={isPolling && !isPaused}/>
                <Readout label="errorCount" value={errorCount} tone={errorCount ? 'danger' : 'default'}/>
                <Readout label="nextDelay" value={`${nextDelay}ms`} tone={nextDelay > 1000 ? 'danger' : 'accent'}/>
                <Readout label="lastUpdated" value={lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'null'}/>
            </ReadoutGrid>

            <Note className="mt-4">
                {error instanceof Error ? `Last error: ${error.message}. ` : ''}
                Each call starts only after the previous one finished, so slow responses never pile up.
            </Note>
        </Stage>
    );
}
