'use client'

import {useEffect, useRef, useState} from 'react';
import {useLongPress} from '@zenuilabs/react-hooks';
import {Button, Log, Meter, Pad, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const DELAYS = [400, 800, 1500];

export default function UseLongPressDemo() {
    const [delay, setDelay] = useState(800);
    const [holding, setHolding] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [fired, setFired] = useState(0);
    const [entries, setEntries] = useState<string[]>([]);
    const startedAt = useRef(0);

    const log = (line: string) => setEntries(prev => [line, ...prev].slice(0, 12));

    const bind = useLongPress(() => {
        setFired(n => n + 1);
        log(`callback fired after ${delay} ms`);
    }, {
        delay,
        onStart: () => {
            startedAt.current = performance.now();
            setHolding(true);
            log('onStart');
        },
        onEnd: () => log('onEnd, released after a long press'),
    });

    // Animate the hold progress while the pointer is down.
    useEffect(() => {
        if (!holding) return;
        let frame = requestAnimationFrame(function tick() {
            setElapsed(performance.now() - startedAt.current);
            frame = requestAnimationFrame(tick);
        });
        return () => cancelAnimationFrame(frame);
    }, [holding]);

    const release = () => {
        if (!holding) return;
        setHolding(false);
        if (performance.now() - startedAt.current < delay) log('released early, no callback');
        setElapsed(0);
    };

    return (
        <Stage>
            <StageHeader title="Press and hold" hint="Hold the pad with the mouse or a finger. Let go early and nothing fires."/>
            <div className="space-y-4">
                <Pad
                    {...bind}
                    onPointerUp={release}
                    onPointerLeave={release}
                    onPointerCancel={release}
                    active={holding && elapsed >= delay}
                    className="cursor-pointer select-none touch-none"
                >
                    {holding ? (elapsed >= delay ? 'Fired. Release to finish.' : 'Keep holding') : 'Press and hold here'}
                </Pad>
                <Meter value={Math.min(elapsed, delay)} max={delay} label="Hold progress"/>
                <Row>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">Delay</span>
                    {DELAYS.map(ms => (
                        <Button key={ms} size="sm" variant={ms === delay ? 'primary' : 'secondary'} onClick={() => setDelay(ms)}>
                            {ms} ms
                        </Button>
                    ))}
                </Row>
                <ReadoutGrid>
                    <Readout label="options.delay" value={`${delay} ms`}/>
                    <Readout label="Holding" value={String(holding)} live={holding}/>
                    <Readout label="Callbacks fired" value={fired} tone="accent"/>
                </ReadoutGrid>
                <Log entries={entries}/>
            </div>
        </Stage>
    );
}
