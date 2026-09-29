'use client'

import React, {useEffect, useRef, useState} from 'react';
import {Timer} from 'lucide-react';
import {useLatest} from '@zenuilabs/react-hooks';
import {Button, Log, Meter, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const DELAY = 3000;

export default function UseLatestDemo() {
    const [count, setCount] = useState(0);
    const latest = useLatest(count);
    const [startedAt, setStartedAt] = useState<number | null>(null);
    const [elapsed, setElapsed] = useState(0);
    const [result, setResult] = useState<{ stale: number; fresh: number } | null>(null);
    const [log, setLog] = useState<string[]>([]);
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (timeout.current) clearTimeout(timeout.current);
    }, []);

    const start = () => {
        setResult(null);
        setStartedAt(Date.now());
        timeout.current = setTimeout(() => {
            // This closure was created on the click, so `count` is frozen at that
            // render's value. `latest` is a ref that keeps moving.
            const outcome = {stale: count, fresh: latest.current};
            setResult(outcome);
            setStartedAt(null);
            setLog((prev) => [
                `timer fired: count read ${outcome.stale}, latest.current read ${outcome.fresh}`,
                ...prev,
            ].slice(0, 8));
        }, DELAY);
    };

    useEffect(() => {
        if (startedAt === null) return;
        let frame = requestAnimationFrame(function tick() {
            setElapsed(Date.now() - startedAt);
            frame = requestAnimationFrame(tick);
        });
        return () => cancelAnimationFrame(frame);
    }, [startedAt]);

    const running = startedAt !== null;

    return (
        <Stage>
            <StageHeader
                title="Stale closure vs latest ref"
                hint="Start the 3 second timer, then click +1 a few times before it fires. The timer reads count twice: once from its closure, once from useLatest."
                live={running}
            />

            <Row>
                <Button onClick={start} disabled={running}><Timer className="size-4"/>Start 3s timer</Button>
                <Button variant="secondary" onClick={() => setCount((c) => c + 1)}>+1</Button>
                <span className="font-mono text-2xl tabular-nums text-ink">count = {count}</span>
            </Row>

            <div className="mt-5">
                <Meter value={running ? Math.min(elapsed, DELAY) : result ? DELAY : 0} max={DELAY} label="timer"/>
            </div>

            <ReadoutGrid cols={3} className="mt-5">
                <Readout label="latest.current now" value={count} live/>
                <Readout
                    label="closure read (bug)"
                    value={result ? result.stale : '-'}
                    tone={result && result.stale !== result.fresh ? 'danger' : 'default'}
                />
                <Readout label="latest.current read (fixed)" value={result ? result.fresh : '-'} tone={result ? 'ok' : 'default'}/>
            </ReadoutGrid>
            <div className="mt-4">
                <Log entries={log} empty="Start the timer to compare the two reads."/>
            </div>
            <Note className="mt-3">
                The same bug shows up in intervals, event listeners and effects that you do not want to restart.
                useLatest gives them a ref that always points at the value from the latest render.
            </Note>
        </Stage>
    );
}
