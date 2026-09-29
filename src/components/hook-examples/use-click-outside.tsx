'use client'

import {useRef, useState} from 'react';
import {useClickOutside} from '@zenuilabs/react-hooks';
import {Button, Log, Note, Readout, ReadoutGrid, Stage, StageHeader} from '@/components/demo';

const OPTIONS = ['Rename', 'Duplicate', 'Move to folder', 'Archive'];

export default function UseClickOutsideDemo() {
    const menuRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [closes, setCloses] = useState(0);
    const [entries, setEntries] = useState<string[]>([]);

    // An inline handler is fine: the hook does not re-subscribe when it changes.
    useClickOutside(menuRef, (event) => {
        if (!open) return;
        setOpen(false);
        setCloses(n => n + 1);
        const target = event.target instanceof Element ? event.target.tagName.toLowerCase() : 'unknown';
        setEntries(prev => [`${event.type} outside on <${target}>, menu closed`, ...prev].slice(0, 12));
    });

    return (
        <Stage>
            <StageHeader title="Dismissable menu" hint="Open the menu, then click or tap anywhere outside it."/>
            <div className="space-y-4">
                <div ref={menuRef} className="inline-block">
                    <Button onClick={() => setOpen(o => !o)}>{open ? 'Close menu' : 'Open menu'}</Button>
                    {open && (
                        <ul className="mt-2 w-52 rounded-xl border border-line-strong bg-paper p-1">
                            {OPTIONS.map(option => (
                                <li key={option}>
                                    <button
                                        type="button"
                                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-panel-2"
                                        onClick={() => setEntries(prev => [`picked ${option}`, ...prev].slice(0, 12))}
                                    >
                                        {option}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <ReadoutGrid cols={2}>
                    <Readout label="Menu" value={open ? 'open' : 'closed'} live={open}/>
                    <Readout label="Closed by outside click" value={closes} tone="accent"/>
                </ReadoutGrid>
                <Log entries={entries}/>
                <Note>Clicks inside the menu, including its items, do not count as outside.</Note>
            </div>
        </Stage>
    );
}
