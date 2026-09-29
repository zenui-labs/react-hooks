'use client'

import {useEffect, useRef, useState} from 'react';
import {Redo2, Undo2} from 'lucide-react';
import {useStateHistory} from '@zenuilabs/react-hooks';
import {Button, Kbd, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';
import {cn} from '@/lib/cn';

const SIZE = 12;
const EMPTY: boolean[] = Array(SIZE * SIZE).fill(false);

function paint(grid: boolean[], index: number, on: boolean) {
    if (grid[index] === on) return grid;
    const next = grid.slice();
    next[index] = on;
    return next;
}

export default function UseStateHistoryDemo() {
    const {state, set, undo, redo, canUndo, canRedo, history, pointer, go, clear} =
        useStateHistory<boolean[]>(EMPTY, {capacity: 40});

    // A stroke is drawn into a draft and recorded as one history entry on release.
    const [draft, setDraftState] = useState<boolean[] | null>(null);
    const draftRef = useRef<boolean[] | null>(null);
    const inkRef = useRef(true);
    const grid = draft ?? state;

    const setDraft = (next: boolean[] | null) => {
        draftRef.current = next;
        setDraftState(next);
    };

    useEffect(() => {
        const finish = () => {
            if (!draftRef.current) return;
            set(draftRef.current);
            draftRef.current = null;
            setDraftState(null);
        };
        window.addEventListener('pointerup', finish);
        window.addEventListener('pointercancel', finish);
        return () => {
            window.removeEventListener('pointerup', finish);
            window.removeEventListener('pointercancel', finish);
        };
    }, [set]);

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'z') return;
            const target = event.target as HTMLElement | null;
            if (target?.closest('input, textarea')) return;
            event.preventDefault();
            if (event.shiftKey) redo();
            else undo();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [undo, redo]);

    const filled = grid.filter(Boolean).length;

    return (
        <Stage>
            <StageHeader
                title="Pixel pad with undo"
                hint="Click and drag to paint. Each stroke is one history entry. Drag the slider to scrub through time."
            />

            <div className="grid gap-6 md:grid-cols-[auto_1fr]">
                <div
                    className="grid w-fit touch-none select-none gap-px rounded-lg border border-line-strong bg-line p-px"
                    style={{gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`}}
                    onPointerMove={(event) => {
                        if (!draftRef.current) return;
                        const cell = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
                        const index = Number(cell?.dataset.index);
                        if (Number.isInteger(index)) setDraft(paint(draftRef.current, index, inkRef.current));
                    }}
                >
                    {grid.map((on, i) => (
                        <button
                            key={i}
                            type="button"
                            data-index={i}
                            aria-label={`Cell ${i + 1}`}
                            className={cn('size-5 sm:size-6', on ? 'bg-ink' : 'bg-paper hover:bg-accent-soft')}
                            onPointerDown={(event) => {
                                event.preventDefault();
                                inkRef.current = !state[i];
                                setDraft(paint(state, i, inkRef.current));
                            }}
                        />
                    ))}
                </div>

                <div className="flex min-w-0 flex-col gap-4">
                    <Row>
                        <Button onClick={undo} disabled={!canUndo}><Undo2 size={16}/>Undo</Button>
                        <Button variant="secondary" onClick={redo} disabled={!canRedo}><Redo2 size={16}/>Redo</Button>
                        <Button variant="ghost" onClick={() => set(EMPTY)}>Wipe canvas</Button>
                        <Button variant="ghost" onClick={clear} disabled={history.length === 1}>Forget history</Button>
                    </Row>

                    <div>
                        <div className="mb-2 flex justify-between font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                            <span>Timeline</span>
                            <span className="tabular-nums">{pointer + 1} / {history.length}</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={history.length - 1}
                            value={pointer}
                            onChange={(event) => go(Number(event.target.value))}
                            className="w-full accent-accent"
                            aria-label="History position"
                        />
                        <div className="mt-2 flex flex-wrap gap-1">
                            {history.map((entry, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => go(i)}
                                    title={`${entry.filter(Boolean).length} cells`}
                                    className={cn(
                                        'h-6 min-w-6 rounded border px-1 font-mono text-[10px] tabular-nums transition-colors',
                                        i === pointer
                                            ? 'border-accent bg-accent text-accent-ink'
                                            : i > pointer
                                                ? 'border-dashed border-line-strong text-ink-3'
                                                : 'border-line bg-paper text-ink-2 hover:border-ink'
                                    )}
                                >
                                    {entry.filter(Boolean).length}
                                </button>
                            ))}
                        </div>
                        <Note className="mt-2">
                            Each chip is a snapshot, labelled with its painted cell count. Dashed chips are redo entries;
                            painting after an undo drops them. Capacity is 40. <Kbd>Ctrl</Kbd> <Kbd>Z</Kbd> and{' '}
                            <Kbd>Shift</Kbd> <Kbd>Ctrl</Kbd> <Kbd>Z</Kbd> work too.
                        </Note>
                    </div>
                </div>
            </div>

            <ReadoutGrid cols={4} className="mt-6">
                <Readout label="pointer" value={pointer}/>
                <Readout label="history.length" value={history.length}/>
                <Readout label="canUndo" value={String(canUndo)} tone={canUndo ? 'accent' : 'default'}/>
                <Readout label="canRedo" value={String(canRedo)} tone={canRedo ? 'accent' : 'default'}/>
            </ReadoutGrid>
            <Note className="mt-3">{filled} cells painted in the current state.</Note>
        </Stage>
    );
}
