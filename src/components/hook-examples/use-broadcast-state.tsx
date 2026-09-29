'use client'

import {useEffect, useState} from 'react';
import {ExternalLink, Minus, Plus} from 'lucide-react';
import {useBroadcastState} from '@zenuilabs/react-hooks';
import {Button, Field, Input, Led, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader, Unsupported} from '@/components/demo';

interface Board {
    votes: number;
    note: string;
    by: string;
}

const TAB = Math.random().toString(36).slice(2, 6).toUpperCase();

export default function UseBroadcastStateDemo() {
    const [board, setBoard, {isSupported, transport, source}] = useBroadcastState<Board>('zenui-demo-board', {
        votes: 0,
        note: '',
        by: '',
    });
    const [log, setLog] = useState<string[]>([]);
    const [ready, setReady] = useState(false);

    useEffect(() => setReady(true), []);

    useEffect(() => {
        if (source !== 'remote') return;
        const time = new Date().toLocaleTimeString();
        setLog((current) => [`${time}  update from tab ${board.by || '?'}: votes ${board.votes}`, ...current].slice(0, 20));
    }, [board, source]);

    const vote = (delta: number) => setBoard((b) => ({...b, votes: b.votes + delta, by: TAB}));

    return (
        <Stage>
            <StageHeader
                title="Shared across tabs"
                hint="Open this page in a second tab, put the tabs side by side, and change the votes or the note in either one."
            />

            {ready && !isSupported && <div className="mb-5"><Unsupported api="BroadcastChannel"/></div>}

            <Row className="mb-5">
                <Led on={source === 'remote'} label={source === 'remote' ? `Last change from tab ${board.by}` : source === 'local' ? 'Last change from this tab' : 'No changes yet'}/>
                <Button size="sm" variant="secondary" onClick={() => window.open(window.location.href, '_blank', 'noopener')}>
                    <ExternalLink size={14}/>Open a second tab
                </Button>
            </Row>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper/70 p-4">
                    <Button variant="secondary" aria-label="Vote down" onClick={() => vote(-1)}><Minus size={16}/></Button>
                    <div className="text-center">
                        <div className="font-display text-5xl font-semibold tabular-nums text-ink">{board.votes}</div>
                        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">votes</div>
                    </div>
                    <Button aria-label="Vote up" onClick={() => vote(1)}><Plus size={16}/></Button>
                </div>
                <Field label="Shared note" hint="Every keystroke is sent to the other tabs.">
                    <Input
                        value={board.note}
                        placeholder="Type here, watch the other tab"
                        onChange={(e) => setBoard((b) => ({...b, note: e.target.value, by: TAB}))}
                    />
                </Field>
            </div>

            <Log className="mt-4" entries={log} empty="Updates received from other tabs are listed here."/>

            <ReadoutGrid cols={4} className="mt-6">
                <Readout label="this tab" value={TAB}/>
                <Readout label="isSupported" value={String(isSupported)} tone={isSupported ? 'ok' : 'danger'}/>
                <Readout label="transport" value={transport}/>
                <Readout label="source" value={source} tone={source === 'remote' ? 'accent' : 'default'}/>
            </ReadoutGrid>
            <Note className="mt-3">
                A tab that opens later asks the others for the current value, so it starts in sync. When BroadcastChannel is
                missing, the hook falls back to localStorage and the storage event.
            </Note>
        </Stage>
    );
}
