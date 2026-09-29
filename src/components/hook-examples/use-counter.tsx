'use client'

import {useState} from 'react';
import {Minus, Plus, RotateCcw} from 'lucide-react';
import {useCounter} from '@zenuilabs/react-hooks';
import {Button, Meter, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const MIN = 0;
const MAX = 20;
const STEPS = [1, 2, 5];

export default function UseCounterDemo() {
    const [step, setStep] = useState(1);
    const {count, increment, decrement, reset, set} = useCounter(4, {min: MIN, max: MAX, step});

    return (
        <Stage>
            <StageHeader title="Ticket quantity" hint={`Limited to ${MIN} to ${MAX}. Try going past either end.`}/>
            <div className="space-y-5">
                <div className="flex items-center justify-center gap-4">
                    <Button variant="secondary" aria-label="Decrement" onClick={decrement} disabled={count === MIN}>
                        <Minus size={16}/>
                    </Button>
                    <span className="w-24 text-center font-display text-5xl font-semibold tabular-nums text-ink">{count}</span>
                    <Button aria-label="Increment" onClick={increment} disabled={count === MAX}>
                        <Plus size={16}/>
                    </Button>
                </div>
                <Meter value={count} max={MAX} label="Capacity"/>
                <Row>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">Step</span>
                    {STEPS.map(s => (
                        <Button key={s} size="sm" variant={s === step ? 'primary' : 'secondary'} onClick={() => setStep(s)}>
                            {s}
                        </Button>
                    ))}
                    <Button size="sm" variant="secondary" onClick={() => set(99)}>set(99)</Button>
                    <Button size="sm" variant="ghost" onClick={reset}><RotateCcw size={14}/> reset()</Button>
                </Row>
                <ReadoutGrid>
                    <Readout label="count" value={count} tone="accent"/>
                    <Readout label="options.step" value={step}/>
                    <Readout label="min / max" value={`${MIN} / ${MAX}`}/>
                </ReadoutGrid>
                <Note>set(99) is clamped to the max, so the count stops at {MAX}.</Note>
            </div>
        </Stage>
    );
}
