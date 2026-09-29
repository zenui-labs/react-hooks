'use client'

import {useState} from 'react';
import {useToggle} from '@zenuilabs/react-hooks';
import {Button, Log, Pad, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

export default function UseToggleDemo() {
    const {value, toggle, setTrue, setFalse, set, reset} = useToggle(true);
    const [calls, setCalls] = useState<string[]>([]);

    const run = (label: string, fn: () => void) => {
        fn();
        setCalls(prev => [label, ...prev].slice(0, 12));
    };

    return (
        <Stage>
            <StageHeader title="Notifications switch" hint="Click the panel to toggle it, or call each helper directly."/>
            <div className="space-y-4">
                <Pad active={value} onClick={() => run('toggle()', toggle)} className="cursor-pointer select-none">
                    <div>
                        <p className="font-display text-2xl font-semibold text-ink">{value ? 'On' : 'Off'}</p>
                        <p className="mt-1 text-ink-2">Notifications are {value ? 'enabled' : 'muted'}.</p>
                    </div>
                </Pad>
                <Row>
                    <Button onClick={() => run('toggle()', toggle)}>toggle()</Button>
                    <Button variant="secondary" onClick={() => run('setTrue()', setTrue)}>setTrue()</Button>
                    <Button variant="secondary" onClick={() => run('setFalse()', setFalse)}>setFalse()</Button>
                    <Button variant="secondary" onClick={() => {
                        const next = Math.random() > 0.5;
                        run(`set(${next})`, () => set(next));
                    }}>set(random)</Button>
                    <Button variant="ghost" onClick={() => run('reset()', reset)}>reset()</Button>
                </Row>
                <ReadoutGrid cols={2}>
                    <Readout label="value" value={String(value)} live={value} tone={value ? 'accent' : 'default'}/>
                    <Readout label="Initial value" value="true"/>
                </ReadoutGrid>
                <Log entries={calls} empty="Call a helper to see it here."/>
            </div>
        </Stage>
    );
}
