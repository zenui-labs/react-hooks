'use client'

import {useEffect, useRef, useState} from 'react';
import {useMouseWheel} from '@zenuilabs/react-hooks';
import {Meter, Pad, Readout, ReadoutGrid, Stage, StageHeader} from '@/components/demo';

export default function UseMouseWheelDemo() {
    const ref = useRef<HTMLDivElement>(null);
    const wheel = useMouseWheel(ref);
    const [level, setLevel] = useState(50);
    const [events, setEvents] = useState(0);

    // Every wheel event returns a new object, so this runs once per event even when the deltas repeat.
    useEffect(() => {
        if (wheel.deltaX === 0 && wheel.deltaY === 0 && wheel.deltaZ === 0) return;
        setEvents((n) => n + 1);
        setLevel((value) => Math.min(100, Math.max(0, value - wheel.deltaY * 0.05)));
    }, [wheel]);

    return (
        <Stage>
            <StageHeader
                title="A wheel-driven dial"
                hint="Scroll inside the pad with a mouse wheel or trackpad. Up raises the level and down lowers it. Sideways scrolling shows in deltaX."
            />
            <div className="space-y-4">
                <Pad ref={ref} active={events > 0} className="block h-56 min-h-0 overflow-y-auto overscroll-contain p-0">
                    <div className="flex h-[200%] items-start justify-center pt-20">
                        <span className="font-display text-5xl font-semibold tabular-nums text-ink">{Math.round(level)}</span>
                    </div>
                </Pad>
                <Meter label="level" value={level}/>
                <ReadoutGrid cols={4}>
                    <Readout label="deltaX" value={wheel.deltaX.toFixed(1)}/>
                    <Readout label="deltaY" value={wheel.deltaY.toFixed(1)} tone="signal"/>
                    <Readout label="deltaZ" value={wheel.deltaZ.toFixed(1)}/>
                    <Readout label="events" value={events}/>
                </ReadoutGrid>
            </div>
        </Stage>
    );
}
