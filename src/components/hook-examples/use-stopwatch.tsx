'use client'

import React, {useEffect} from 'react';
import {useStopwatch} from '@zenuilabs/react-hooks';
import {Flag, Pause, Play, RotateCcw} from 'lucide-react';
import {Button, Kbd, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

function format(ms: number) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor(ms / 1000) % 60;
    const hundredths = Math.floor(ms / 10) % 100;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
}

export default function UseStopwatchDemo() {
    const {elapsed, laps, isRunning, toggle, reset, lap} = useStopwatch();

    // Space toggles, L records a lap, R resets. Ignored while typing in a field.
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
            if (event.code === 'Space') {
                // A focused button already handles Space as a click.
                if (target?.closest('button, a')) return;
                event.preventDefault();
                toggle();
            } else if (event.key === 'l' || event.key === 'L') {
                lap();
            } else if (event.key === 'r' || event.key === 'R') {
                reset();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [toggle, lap, reset]);

    const splits = laps.map((l) => l.split);
    const fastest = laps.length > 1 ? Math.min(...splits) : null;
    const slowest = laps.length > 1 ? Math.max(...splits) : null;
    const lastTotal = laps.length ? laps[laps.length - 1].total : 0;

    return (
        <Stage>
            <StageHeader
                title="Lap timer"
                hint={<>Time a few laps. Fastest and slowest splits are marked. Keys: <Kbd>Space</Kbd> start and pause, <Kbd>L</Kbd> lap, <Kbd>R</Kbd> reset.</>}
            />

            <div className="text-center font-mono text-6xl font-semibold tabular-nums tracking-tight text-ink sm:text-7xl">
                {format(elapsed)}
            </div>
            <div className="mt-1 text-center font-mono text-sm tabular-nums text-ink-3">
                current lap {format(elapsed - lastTotal)}
            </div>

            <Row className="mt-6 justify-center">
                <Button onClick={toggle}>{isRunning ? <><Pause size={16}/> Pause</> : <><Play size={16}/> {elapsed ? 'Resume' : 'Start'}</>}</Button>
                <Button variant="secondary" onClick={() => lap()} disabled={!isRunning}><Flag size={16}/> Lap</Button>
                <Button variant="ghost" onClick={reset} disabled={!elapsed}><RotateCcw size={16}/> Reset</Button>
            </Row>

            <div className="mt-6 max-h-56 overflow-auto rounded-xl border border-line bg-paper/80">
                <table className="w-full font-mono text-sm tabular-nums">
                    <thead className="sticky top-0 bg-panel text-left text-[11px] uppercase tracking-[0.08em] text-ink-3">
                        <tr>
                            <th className="px-4 py-2 font-normal">Lap</th>
                            <th className="px-4 py-2 text-right font-normal">Split</th>
                            <th className="px-4 py-2 text-right font-normal">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                        {laps.length === 0 && (
                            <tr><td colSpan={3} className="px-4 py-3 text-xs text-ink-3">No laps yet.</td></tr>
                        )}
                        {[...laps].reverse().map((l) => (
                            <tr key={l.index} className={l.split === fastest ? 'text-ok' : l.split === slowest ? 'text-danger' : 'text-ink'}>
                                <td className="px-4 py-2">{String(l.index).padStart(2, '0')}</td>
                                <td className="px-4 py-2 text-right">{format(l.split)}</td>
                                <td className="px-4 py-2 text-right text-ink-2">{format(l.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ReadoutGrid cols={3} className="mt-4">
                <Readout label="elapsed" value={`${Math.round(elapsed)}ms`} tone="accent"/>
                <Readout label="isRunning" value={String(isRunning)} live={isRunning}/>
                <Readout label="laps.length" value={laps.length}/>
            </ReadoutGrid>

            <Note className="mt-4">
                Elapsed time is measured with performance.now() and banked on pause, so the display can update at any
                rate without losing time.
            </Note>
        </Stage>
    );
}
