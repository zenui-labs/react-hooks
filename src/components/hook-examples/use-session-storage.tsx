'use client'

import {useEffect, useState} from 'react';
import {useSessionStorage} from '@zenuilabs/react-hooks';
import {Button, Meter, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const KEY = 'zenui-demo-checkout-step';
const STEPS = ['Cart', 'Shipping', 'Payment', 'Review'];

export default function UseSessionStorageDemo() {
    const {value: step, setValue: setStep, remove} = useSessionStorage<number>(KEY, 0);
    const [raw, setRaw] = useState<string | null>(null);

    useEffect(() => {
        setRaw(window.sessionStorage.getItem(KEY));
    }, [step]);

    return (
        <Stage>
            <StageHeader
                title="Checkout progress"
                hint="Move through the steps, then reload the page. The step survives a reload but not closing the tab."
            />
            <div className="space-y-5">
                <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {STEPS.map((label, i) => (
                        <li
                            key={label}
                            className={
                                i === step
                                    ? 'rounded-lg border border-accent bg-accent-soft px-3 py-2 text-sm text-ink'
                                    : 'rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink-3'
                            }
                        >
                            <span className="font-mono text-xs">{String(i + 1).padStart(2, '0')}</span> {label}
                        </li>
                    ))}
                </ol>
                <Meter value={step + 1} max={STEPS.length} label="Progress"/>
                <Row>
                    <Button variant="secondary" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>
                        Back
                    </Button>
                    <Button disabled={step === STEPS.length - 1} onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}>
                        Next step
                    </Button>
                    <Button variant="ghost" onClick={remove}>Start over</Button>
                </Row>
                <ReadoutGrid>
                    <Readout label="value" value={step} tone="accent"/>
                    <Readout label="Current step" value={STEPS[step]}/>
                    <Readout label="sessionStorage" value={raw ?? 'null'}/>
                </ReadoutGrid>
                <Note>Start over calls remove, which deletes the key and returns to the initial value.</Note>
            </div>
        </Stage>
    );
}
