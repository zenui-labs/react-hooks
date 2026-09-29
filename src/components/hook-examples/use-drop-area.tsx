'use client'

import {useState} from 'react';
import {Upload} from 'lucide-react';
import {useDropArea} from '@zenuilabs/react-hooks';
import {Button, Note, Pad, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const FILTERS: { label: string; accept?: string[] }[] = [
    {label: 'Any file'},
    {label: 'Images', accept: ['image/*']},
    {label: 'PDF and text', accept: ['.pdf', 'text/plain']},
];

function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function UseDropAreaDemo() {
    const [filter, setFilter] = useState(0);
    const [multiple, setMultiple] = useState(true);
    const {ref, isOver, files, rejected, handlers, clear} = useDropArea<HTMLDivElement>({
        accept: FILTERS[filter].accept,
        multiple,
    });

    return (
        <Stage>
            <StageHeader title="File upload area" hint="Drop files from your computer. Change the filter to see files rejected."/>
            <div className="space-y-4">
                <Row>
                    {FILTERS.map((f, i) => (
                        <Button key={f.label} size="sm" variant={i === filter ? 'primary' : 'secondary'} onClick={() => setFilter(i)}>
                            {f.label}
                        </Button>
                    ))}
                    <Button size="sm" variant="secondary" onClick={() => setMultiple(m => !m)}>
                        multiple: {String(multiple)}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={clear}>clear()</Button>
                </Row>
                <Pad ref={ref} {...handlers} active={isOver} className="flex-col gap-2">
                    <Upload size={20}/>
                    <p>{isOver ? 'Release to add the files' : 'Drag files here'}</p>
                </Pad>
                {files.length > 0 && (
                    <ul className="divide-y divide-line rounded-xl border border-line bg-paper/80 font-mono text-xs">
                        {files.map(file => (
                            <li key={`${file.name}-${file.size}`} className="flex justify-between gap-3 px-3 py-2">
                                <span className="truncate text-ink">{file.name}</span>
                                <span className="shrink-0 text-ink-3">{file.type || 'unknown'} / {formatSize(file.size)}</span>
                            </li>
                        ))}
                    </ul>
                )}
                <ReadoutGrid>
                    <Readout label="isOver" value={String(isOver)} live={isOver}/>
                    <Readout label="files" value={files.length} tone="accent"/>
                    <Readout label="rejected" value={rejected.length} tone={rejected.length ? 'danger' : 'default'}/>
                </ReadoutGrid>
                {rejected.length > 0 && (
                    <Note>Rejected: {rejected.map(file => file.name).join(', ')}</Note>
                )}
            </div>
        </Stage>
    );
}
