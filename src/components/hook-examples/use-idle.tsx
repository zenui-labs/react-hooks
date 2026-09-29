'use client'

import {useEffect, useRef, useState} from 'react';
import {useIdle} from '@zenuilabs/react-hooks';
import {cn} from '@/lib/cn';
import {Button, Log, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const TIMEOUTS = [3000, 5000, 10000];

export default function UseIdleDemo() {
    const [timeout, setTimeoutMs] = useState(3000);
    const {isIdle, lastActive} = useIdle(timeout);
    const [log, setLog] = useState<string[]>([]);
    const previous = useRef(isIdle);

    useEffect(() => {
        if (previous.current === isIdle) return;
        previous.current = isIdle;
        const time = new Date().toLocaleTimeString();
        setLog((entries) => [`${time}  ${isIdle ? 'went idle' : 'back to active'}`, ...entries].slice(0, 8));
    }, [isIdle]);

    return (
        <Stage>
            <StageHeader
                title="Are you still there"
                hint={`Keep your hands off the mouse and keyboard for ${timeout / 1000} seconds. Then move the mouse.`}
                live={!isIdle}
            />
            <div className="space-y-4">
                <div
                    className={cn(
                        'flex h-32 items-center justify-center rounded-xl border font-display text-3xl font-semibold tracking-tight transition-colors duration-300',
                        isIdle ? 'border-line bg-panel-2 text-ink-3' : 'border-accent bg-accent-soft text-ink'
                    )}
                >
                    {isIdle ? 'Idle' : 'Active'}
                </div>
                <Row>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">timeout</span>
                    {TIMEOUTS.map((ms) => (
                        <Button key={ms} size="sm" variant={timeout === ms ? 'primary' : 'secondary'} onClick={() => setTimeoutMs(ms)}>
                            {ms / 1000} s
                        </Button>
                    ))}
                </Row>
                <ReadoutGrid>
                    <Readout label="isIdle" value={String(isIdle)} tone={isIdle ? 'signal' : 'default'}/>
                    <Readout label="lastActive" value={lastActive ? new Date(lastActive).toLocaleTimeString() : 'null'}/>
                    <Readout label="timeout" value={`${timeout} ms`}/>
                </ReadoutGrid>
                <Log entries={log} empty="No transitions yet."/>
            </div>
        </Stage>
    );
}
