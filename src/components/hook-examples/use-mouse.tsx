'use client'

import {useRef} from 'react';
import {useMouse} from '@zenuilabs/react-hooks';
import {Pad, Readout, ReadoutGrid, Stage, StageHeader} from '@/components/demo';

export default function UseMouseDemo() {
    const ref = useRef<HTMLDivElement>(null);
    const local = useMouse(ref);
    const page = useMouse();

    return (
        <Stage>
            <StageHeader
                title="Two coordinate systems"
                hint="Move the pointer over the pad. The dot uses coordinates relative to the pad. The page readouts come from a second call without a ref."
            />
            <div className="space-y-4">
                <Pad ref={ref} className="min-h-56 cursor-crosshair overflow-hidden">
                    <span className="pointer-events-none select-none">Move here</span>
                    <span
                        className="pointer-events-none absolute left-0 top-0 h-4 w-4 rounded-full bg-accent"
                        style={{transform: `translate(${local.x - 8}px, ${local.y - 8}px)`}}
                    />
                    <span
                        className="pointer-events-none absolute left-0 top-0 h-full w-px bg-line-strong"
                        style={{transform: `translateX(${local.x}px)`}}
                    />
                    <span
                        className="pointer-events-none absolute left-0 top-0 h-px w-full bg-line-strong"
                        style={{transform: `translateY(${local.y}px)`}}
                    />
                </Pad>
                <ReadoutGrid cols={4}>
                    <Readout label="pad x" value={Math.round(local.x)} tone="signal"/>
                    <Readout label="pad y" value={Math.round(local.y)} tone="signal"/>
                    <Readout label="page x" value={Math.round(page.x)}/>
                    <Readout label="page y" value={Math.round(page.y)}/>
                </ReadoutGrid>
            </div>
        </Stage>
    );
}
