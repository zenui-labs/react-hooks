'use client'

import {useState} from 'react';
import {Pause, Play, RotateCcw} from 'lucide-react';
import {useInterval} from '@zenuilabs/react-hooks';
import {cn} from '@/lib/cn';
import {Button, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const DELAYS = [250, 500, 1000];
const CELLS = 12;

export default function UseIntervalDemo() {
    const [ticks, setTicks] = useState(0);
    const [running, setRunning] = useState(true);
    const [delay, setDelay] = useState(500);

    useInterval(() => setTicks(ticks + 1), running ? delay : null);

    const active = ticks % CELLS;

    return (
        <Stage>
            <StageHeader
                title="A ticking sequencer"
                hint="Each tick lights the next cell. Pause passes null as the delay. Changing the delay restarts the timer at the new speed."
                live={running}
            />
            <div className="space-y-5">
                <div className="grid grid-cols-6 gap-2 sm:grid-cols-12" aria-hidden>
                    {Array.from({length: CELLS}, (_, i) => (
                        <div
                            key={i}
                            className={cn(
                                'h-10 rounded-lg border border-line transition-colors duration-100',
                                i === active ? 'bg-signal' : i < active ? 'bg-accent-soft' : 'bg-paper'
                            )}
                        />
                    ))}
                </div>
                <Row>
                    <Button onClick={() => setRunning(!running)}>
                        {running ? <Pause size={16}/> : <Play size={16}/>}
                        {running ? 'Pause' : 'Resume'}
                    </Button>
                    <Button variant="ghost" onClick={() => setTicks(0)}>
                        <RotateCcw size={16}/> Reset
                    </Button>
                    <span className="mx-1 h-6 w-px bg-line"/>
                    {DELAYS.map((ms) => (
                        <Button key={ms} size="sm" variant={delay === ms ? 'primary' : 'secondary'} onClick={() => setDelay(ms)}>
                            {ms} ms
                        </Button>
                    ))}
                </Row>
                <ReadoutGrid>
                    <Readout label="delay" value={running ? `${delay} ms` : 'null'}/>
                    <Readout label="ticks" value={ticks} live={running}/>
                    <Readout label="elapsed" value={`${((ticks * delay) / 1000).toFixed(1)} s`}/>
                </ReadoutGrid>
            </div>
        </Stage>
    );
}
