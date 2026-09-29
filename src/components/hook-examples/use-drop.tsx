'use client'

import {type DragEvent, useEffect, useState} from 'react';
import {useDrop} from '@zenuilabs/react-hooks';
import {Log, Pad, Readout, ReadoutGrid, Stage, StageHeader} from '@/components/demo';

const CHIPS = ['Invoice #1042', 'Meeting notes', 'https://zenui.net'];

function describe(data: unknown): string {
    if (!data) return 'null';
    if (typeof data === 'string') return data;
    if (data instanceof FileList) return Array.from(data).map(file => file.name).join(', ');
    return 'unknown';
}

export default function UseDropDemo() {
    const {ref, isOver, data, handlers} = useDrop<HTMLDivElement>();
    const [entries, setEntries] = useState<string[]>([]);

    useEffect(() => {
        if (!data) return;
        const kind = data instanceof FileList ? `${data.length} file(s)` : 'text';
        setEntries(prev => [`dropped ${kind}: ${describe(data)}`, ...prev].slice(0, 10));
    }, [data]);

    const onDragStart = (e: DragEvent<HTMLDivElement>, text: string) => {
        e.dataTransfer.setData('text/plain', text);
    };

    return (
        <Stage>
            <StageHeader title="Drop zone" hint="Drag a chip, some selected text or a file from your computer onto the zone."/>
            <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    {CHIPS.map(chip => (
                        <div
                            key={chip}
                            draggable
                            onDragStart={e => onDragStart(e, chip)}
                            className="cursor-grab rounded-lg border border-line-strong bg-paper px-3 py-1.5 font-mono text-xs text-ink active:cursor-grabbing"
                        >
                            {chip}
                        </div>
                    ))}
                </div>
                <Pad ref={ref} {...handlers} active={isOver} className="min-h-48 flex-col gap-3">
                    <p>{isOver ? 'Release to drop' : 'Drop here'}</p>
                    {/* Nested elements: moving over them does not make isOver flicker. */}
                    <div className="flex gap-2">
                        <span className="rounded-md border border-line bg-panel px-2 py-1 text-xs text-ink-3">child</span>
                        <span className="rounded-md border border-line bg-panel px-2 py-1 text-xs text-ink-3">child</span>
                    </div>
                </Pad>
                <ReadoutGrid cols={2}>
                    <Readout label="isOver" value={String(isOver)} live={isOver}/>
                    <Readout label="data" value={describe(data)} tone="accent"/>
                </ReadoutGrid>
                <Log entries={entries} empty="Nothing dropped yet."/>
            </div>
        </Stage>
    );
}
