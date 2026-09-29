'use client'

import React, {useRef, useState} from 'react';
import {useAnimationFrame, useWorker} from '@zenuilabs/react-hooks';
import {Cpu} from 'lucide-react';
import {Button, Field, Input, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader, Unsupported} from '@/components/demo';

// Deliberately slow and self-contained: the worker receives this function's source text.
function fib(n: number): number {
    return n < 2 ? n : fib(n - 1) + fib(n - 2);
}

export default function UseWorkerDemo() {
    const [input, setInput] = useState('37');
    const [mainBusy, setMainBusy] = useState(false);
    const [log, setLog] = useState<string[]>([]);
    const [worstFrame, setWorstFrame] = useState(0);
    const spinner = useRef<HTMLDivElement>(null);
    const angle = useRef(0);
    const worst = useRef(0);

    const n = Math.min(42, Math.max(20, Math.round(Number(input)) || 20));
    const {run, status, result, error, terminate, isSupported} = useWorker(fib, {timeout: 15000});

    const add = (line: string) => setLog((prev) => [line, ...prev].slice(0, 12));

    // The spinner is driven from JavaScript on purpose: CSS animations can keep running on the
    // compositor even when the main thread is blocked, which would hide the difference.
    useAnimationFrame(({delta}) => {
        angle.current = (angle.current + delta * 0.36) % 360;
        if (spinner.current) spinner.current.style.transform = `rotate(${angle.current}deg)`;
        if (delta > worst.current) {
            worst.current = delta;
            setWorstFrame(Math.round(delta));
        }
    });

    if (!isSupported) return <Unsupported api="Worker"/>;

    const resetWorst = () => {
        worst.current = 0;
        setWorstFrame(0);
    };

    const runOnMain = () => {
        resetWorst();
        setMainBusy(true);
        // Give React a frame to paint the busy state before blocking the thread.
        setTimeout(() => {
            const t0 = performance.now();
            const value = fib(n);
            const ms = Math.round(performance.now() - t0);
            setMainBusy(false);
            add(`main thread: fib(${n}) = ${value} in ${ms}ms`);
        }, 50);
    };

    const runInWorker = () => {
        resetWorst();
        const t0 = performance.now();
        run(n).then(
            (value) => add(`worker: fib(${n}) = ${value} in ${Math.round(performance.now() - t0)}ms`),
            (reason: Error) => add(`worker: ${reason.name} ${reason.message}`)
        );
    };


    return (
        <Stage>
            <StageHeader
                title="Main thread or worker"
                hint="Both buttons compute the same naive Fibonacci number. On the main thread the spinner freezes until it finishes. In the worker it keeps turning and the page stays responsive."
            />

            <div className="flex flex-wrap items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-line bg-paper/80">
                    <div ref={spinner} className="h-16 w-1.5 rounded-full bg-accent"/>
                </div>
                <div className="min-w-40 flex-1">
                    <Field label="n" hint="37 takes about half a second on a fast laptop. Each step up is roughly 1.6x slower.">
                        <Input
                            type="number"
                            min={20}
                            max={42}
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            onBlur={() => setInput(String(n))}
                        />
                    </Field>
                </div>
            </div>

            <Row className="mt-5">
                <Button onClick={runInWorker} disabled={status === 'running'}><Cpu size={16}/> Run in worker</Button>
                <Button variant="secondary" onClick={runOnMain} disabled={mainBusy}>Run on main thread</Button>
                <Button variant="danger" onClick={terminate} disabled={status !== 'running'}>Terminate</Button>
            </Row>

            <ReadoutGrid cols={4} className="mt-5">
                <Readout label="status" value={mainBusy ? 'main busy' : status} live={status === 'running'} tone={status === 'error' || status === 'timeout' ? 'danger' : 'default'}/>
                <Readout label="result" value={result ?? 'undefined'} tone="accent"/>
                <Readout label="longest frame" value={`${worstFrame}ms`} tone={worstFrame > 100 ? 'danger' : 'ok'}/>
                <Readout label="error" value={error ? error.name : 'null'} tone={error ? 'danger' : 'default'}/>
            </ReadoutGrid>

            <Log className="mt-4" entries={log} empty="Run it both ways and compare the longest frame."/>

            <Note className="mt-4">
                The function is sent to the worker as source text, so it cannot use variables from the component.
                Terminate kills the worker mid-run and rejects the promise; the next run starts a fresh one.
            </Note>
        </Stage>
    );
}
