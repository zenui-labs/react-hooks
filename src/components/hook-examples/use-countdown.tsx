'use client'

import React, {useState} from 'react';
import {useCountdown, type CountdownTarget} from '@zenuilabs/react-hooks';
import {Pause, Play, RotateCcw} from 'lucide-react';
import {Button, Log, Meter, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

function nextMidnight() {
    const date = new Date();
    date.setHours(24, 0, 0, 0);
    return date;
}

const PRESETS: Array<{ label: string; target: () => CountdownTarget }> = [
    {label: '10 s', target: () => 10_000},
    {label: '1 min', target: () => 60_000},
    {label: '25 min', target: () => 25 * 60_000},
    {label: 'Until midnight', target: nextMidnight},
];

/** One split-flap style tile per digit. */
function Flap({value}: { value: string }) {
    return (
        <span className="relative inline-flex h-16 w-11 items-center justify-center overflow-hidden rounded-lg border border-line-strong bg-panel-2 font-mono text-4xl font-semibold tabular-nums text-ink sm:h-20 sm:w-14 sm:text-5xl">
            {value}
            <span className="absolute inset-x-0 top-1/2 h-px bg-line-strong" aria-hidden/>
        </span>
    );
}

function Group({value, label}: { value: number; label: string }) {
    const [a, b] = String(value).padStart(2, '0').slice(-2).split('');
    return (
        <div className="flex flex-col items-center gap-1.5">
            <div className="flex gap-1"><Flap value={a}/><Flap value={b}/></div>
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">{label}</span>
        </div>
    );
}

export default function UseCountdownDemo() {
    const [log, setLog] = useState<string[]>([]);
    const [preset, setPreset] = useState(0);

    const {remaining, days, hours, minutes, seconds, progress, isRunning, isComplete, start, pause, resume, reset} =
        useCountdown(10_000, {
            autoStart: false,
            onComplete: () => setLog((prev) => [`Completed at ${new Date().toLocaleTimeString()}`, ...prev]),
        });

    const choose = (index: number) => {
        setPreset(index);
        reset(PRESETS[index].target());
        start();
    };

    const started = remaining > 0 && (isRunning || progress > 0);

    return (
        <Stage>
            <StageHeader
                title="Countdown board"
                hint="Pick a duration or count to midnight. The time left is recomputed from the clock on every tick, so switching tabs or pausing never makes it drift."
            />

            <Row className="mb-6">
                {PRESETS.map((p, i) => (
                    <Button key={p.label} size="sm" variant={preset === i ? 'primary' : 'secondary'} onClick={() => choose(i)}>
                        {p.label}
                    </Button>
                ))}
            </Row>

            <div className="flex flex-wrap items-start justify-center gap-3 sm:gap-5" aria-live="off">
                {days > 0 && <Group value={days} label="days"/>}
                <Group value={hours} label="hours"/>
                <Group value={minutes} label="min"/>
                <Group value={seconds} label="sec"/>
            </div>

            <div className="mx-auto mt-6 max-w-md">
                <Meter value={progress * 100} label="elapsed"/>
            </div>

            <Row className="mt-6 justify-center">
                {isRunning ? (
                    <Button onClick={pause}><Pause size={16}/> Pause</Button>
                ) : started ? (
                    <Button onClick={resume}><Play size={16}/> Resume</Button>
                ) : (
                    <Button onClick={start}><Play size={16}/> {isComplete ? 'Restart' : 'Start'}</Button>
                )}
                <Button variant="secondary" onClick={() => reset()}><RotateCcw size={16}/> Reset</Button>
            </Row>

            <ReadoutGrid cols={4} className="mt-6">
                <Readout label="remaining" value={`${remaining}ms`} tone="accent"/>
                <Readout label="isRunning" value={String(isRunning)} live={isRunning}/>
                <Readout label="isComplete" value={String(isComplete)} tone={isComplete ? 'ok' : 'default'}/>
                <Readout label="progress" value={progress.toFixed(3)}/>
            </ReadoutGrid>

            <Log className="mt-4" entries={log} empty="onComplete has not fired yet."/>
        </Stage>
    );
}
