'use client'

import {type PointerEvent, useEffect, useState} from 'react';
import {useThrottle} from '@zenuilabs/react-hooks';
import {Button, Pad, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const DELAYS = [100, 300, 1000];

export default function UseThrottleDemo() {
    const [delay, setDelay] = useState(300);
    const [point, setPoint] = useState({x: 50, y: 50});
    const throttled = useThrottle(point, delay);
    const [rawCount, setRawCount] = useState(0);
    const [throttledCount, setThrottledCount] = useState(0);

    useEffect(() => {
        setThrottledCount(c => c + 1);
    }, [throttled]);

    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPoint({
            x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
            y: Math.round(((e.clientY - rect.top) / rect.height) * 100),
        });
        setRawCount(c => c + 1);
    };

    return (
        <Stage>
            <StageHeader
                title="Pointer, throttled"
                hint="Move the pointer across the pad. The filled dot follows every event, the ring only updates once per delay."
            />
            <div className="space-y-4">
                <Pad onPointerMove={onPointerMove} className="h-56 cursor-crosshair touch-none overflow-hidden p-0">
                    <span
                        className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
                        style={{left: `${point.x}%`, top: `${point.y}%`}}
                    />
                    <span
                        className="pointer-events-none absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent transition-[left,top] duration-150"
                        style={{left: `${throttled.x}%`, top: `${throttled.y}%`}}
                    />
                </Pad>
                <Row>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">Delay</span>
                    {DELAYS.map(ms => (
                        <Button key={ms} size="sm" variant={ms === delay ? 'primary' : 'secondary'} onClick={() => setDelay(ms)}>
                            {ms} ms
                        </Button>
                    ))}
                </Row>
                <ReadoutGrid cols={4}>
                    <Readout label="value" value={`${point.x}, ${point.y}`}/>
                    <Readout label="throttled" value={`${throttled.x}, ${throttled.y}`} tone="accent"/>
                    <Readout label="Raw events" value={rawCount}/>
                    <Readout label="Throttled updates" value={throttledCount}/>
                </ReadoutGrid>
            </div>
        </Stage>
    );
}
