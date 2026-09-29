'use client'

import {useRef, useState} from 'react';
import {useQueue} from '@zenuilabs/react-hooks';
import {Button, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';
import {cn} from '@/lib/cn';

const NAMES = ['Ada', 'Grace', 'Linus', 'Margaret', 'Alan', 'Barbara', 'Ken', 'Radia', 'Dennis', 'Frances'];

export default function UseQueueDemo() {
    const {queue, size, first, last, enqueue, dequeue, peek, clear} = useQueue<string>(['Ada #1', 'Grace #2']);
    const ticket = useRef(3);
    const [served, setServed] = useState<string[]>([]);

    const join = (count = 1) => {
        const people = Array.from({length: count}, () => {
            const n = ticket.current++;
            return `${NAMES[n % NAMES.length]} #${n}`;
        });
        enqueue(...people);
    };

    // dequeue returns the item immediately, so several calls in one handler work.
    const serve = (count: number) => {
        const batch: string[] = [];
        for (let i = 0; i < count; i++) {
            const person = dequeue();
            if (person === undefined) break;
            batch.push(person);
        }
        if (batch.length) {
            setServed((current) => [`served ${batch.join(', ')}`, ...current].slice(0, 20));
        } else {
            setServed((current) => ['dequeue() returned undefined: the line is empty', ...current].slice(0, 20));
        }
    };

    return (
        <Stage>
            <StageHeader title="Service counter" hint="People join at the back and are served from the front. Serve 3 calls dequeue three times in one click."/>

            <div className="mb-5 flex min-h-16 items-center gap-2 overflow-x-auto rounded-xl border border-line bg-paper/70 p-3">
                <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">Front</span>
                {queue.length === 0 && <span className="text-sm text-ink-3">Nobody waiting.</span>}
                {queue.map((person, i) => (
                    <span
                        key={person}
                        className={cn(
                            'shrink-0 rounded-lg border px-2.5 py-1.5 font-mono text-xs',
                            i === 0 ? 'border-accent bg-accent text-accent-ink' : 'border-line-strong bg-panel text-ink'
                        )}
                    >
                        {person}
                    </span>
                ))}
                <span className="ml-auto shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">Back</span>
            </div>

            <Row className="mb-4">
                <Button onClick={() => serve(1)}>Serve next</Button>
                <Button variant="secondary" onClick={() => serve(3)}>Serve 3</Button>
                <Button variant="secondary" onClick={() => join()}>Join line</Button>
                <Button variant="secondary" onClick={() => join(4)}>Bus arrives (+4)</Button>
                <Button variant="ghost" onClick={clear}>Close counter</Button>
                <Button variant="ghost" onClick={() => setServed((c) => [`peek() -> ${peek() ?? 'undefined'}`, ...c].slice(0, 20))}>
                    Peek
                </Button>
            </Row>

            <Log entries={served} empty="Serve someone to see what dequeue returns."/>

            <ReadoutGrid cols={3} className="mt-6">
                <Readout label="size" value={size}/>
                <Readout label="first" value={first ?? 'undefined'} tone="accent"/>
                <Readout label="last" value={last ?? 'undefined'}/>
            </ReadoutGrid>
            <Note className="mt-3">Peek reads the front item without removing it.</Note>
        </Stage>
    );
}
