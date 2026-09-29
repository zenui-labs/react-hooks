'use client'

import {useEffect, useState} from 'react';
import {useResizeObserver, type ResizeObserverHookBox} from '@zenuilabs/react-hooks';
import {Button, Note, Readout, ReadoutGrid, Row, Stage, StageHeader, Unsupported} from '@/components/demo';

const BOXES: ResizeObserverHookBox[] = ['content-box', 'border-box'];

function layoutFor(width: number) {
    if (width < 260) return 'Compact';
    if (width < 420) return 'Regular';
    return 'Wide';
}

export default function UseResizeObserverDemo() {
    const [box, setBox] = useState<ResizeObserverHookBox>('content-box');
    const {ref, width, height, entry, isSupported} = useResizeObserver<HTMLDivElement>({box});
    const [updates, setUpdates] = useState(0);

    // One entry per animation frame at most, so this counts rendered updates, not raw observer calls.
    useEffect(() => {
        if (entry) setUpdates((count) => count + 1);
    }, [entry]);

    const layout = layoutFor(width);

    return (
        <Stage>
            <StageHeader
                title="Resize the box"
                hint="Drag the bottom-right corner. The box reads its own size and switches layout by width, like a container query."
            />
            <div className="space-y-4">
                {!isSupported && <Unsupported api="ResizeObserver"/>}
                <Row>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">options.box</span>
                    {BOXES.map((value) => (
                        <Button key={value} size="sm" variant={value === box ? 'primary' : 'secondary'} onClick={() => setBox(value)}>
                            {value}
                        </Button>
                    ))}
                </Row>
                <div className="overflow-hidden rounded-xl border border-line bg-paper/50 p-3">
                    <div
                        ref={ref}
                        className="relative min-h-28 min-w-44 max-w-full resize overflow-auto rounded-xl border-2 border-dashed border-line-strong bg-panel p-4"
                        style={{width: 340, height: 180}}
                    >
                        <div className="font-mono text-2xl tabular-nums text-ink">
                            {Math.round(width)} <span className="text-ink-3">x</span> {Math.round(height)}
                        </div>
                        <div className={layout === 'Wide' ? 'mt-3 grid grid-cols-3 gap-2' : layout === 'Regular' ? 'mt-3 grid grid-cols-2 gap-2' : 'mt-3 grid grid-cols-1 gap-2'}>
                            {['Inbox', 'Drafts', 'Sent'].map((label) => (
                                <div key={label} className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink-2">
                                    {label}
                                </div>
                            ))}
                        </div>
                        <span className="pointer-events-none absolute bottom-1.5 right-6 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
                            drag corner
                        </span>
                    </div>
                </div>
                <ReadoutGrid cols={4}>
                    <Readout label="width" value={`${width.toFixed(1)} px`}/>
                    <Readout label="height" value={`${height.toFixed(1)} px`}/>
                    <Readout label="Layout" value={layout} tone="accent"/>
                    <Readout label="entry updates" value={updates}/>
                </ReadoutGrid>
                <Note>
                    border-box includes the 2px border and 16px padding on each side, so it reads 36px larger than
                    content-box. Updates are batched with requestAnimationFrame, so a fast drag renders at most once per frame.
                </Note>
            </div>
        </Stage>
    );
}
