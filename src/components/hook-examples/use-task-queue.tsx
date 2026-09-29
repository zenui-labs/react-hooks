'use client'

import {useEffect, useRef, useState} from 'react';
import {Pause, Play, Plus} from 'lucide-react';
import {useTaskQueue} from '@zenuilabs/react-hooks';
import {Button, Meter, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';
import {cn} from '@/lib/cn';

const FILES = ['avatar.png', 'invoice.pdf', 'intro.mp4', 'notes.md', 'data.csv', 'logo.svg', 'backup.zip', 'song.mp3'];

export default function UseTaskQueueDemo() {
    const [concurrency, setConcurrency] = useState(2);
    const {add, tasks, running, pending, isPaused, pause, resume, clear} = useTaskQueue<number>({concurrency});
    // Planned duration per task label, so the demo can draw progress bars.
    const planned = useRef(new Map<string, number>());
    const counter = useRef(0);
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (running === 0) return;
        let frame = requestAnimationFrame(function tick() {
            setNow(Date.now());
            frame = requestAnimationFrame(tick);
        });
        return () => cancelAnimationFrame(frame);
    }, [running]);

    const upload = (count = 1) => {
        for (let i = 0; i < count; i++) {
            const n = counter.current++;
            const label = `${FILES[n % FILES.length]} #${n + 1}`;
            const ms = 900 + Math.round(Math.random() * 2200);
            const fails = Math.random() < 0.15;
            planned.current.set(label, ms);
            add((signal) => new Promise<number>((resolve, reject) => {
                const timer = setTimeout(() => (fails ? reject(new Error('Connection reset')) : resolve(ms)), ms);
                signal.addEventListener('abort', () => {
                    clearTimeout(timer);
                    reject(new Error('Aborted'));
                });
            }), label);
        }
    };

    const active = tasks.filter((t) => t.status === 'running');
    const waiting = tasks.filter((t) => t.status === 'pending');
    const finished = tasks.filter((t) => t.status === 'done' || t.status === 'failed').slice().reverse();
    const done = tasks.filter((t) => t.status === 'done').length;
    const failed = tasks.filter((t) => t.status === 'failed').length;

    return (
        <Stage>
            <StageHeader
                title="Upload queue"
                hint="Add uploads faster than they finish. Only as many run at once as the concurrency allows; the rest wait in line."
                live={running > 0}
            />

            <Row className="mb-4">
                <Button onClick={() => upload(1)}><Plus size={16}/>Add upload</Button>
                <Button variant="secondary" onClick={() => upload(6)}>Add 6</Button>
                <Button variant="secondary" onClick={isPaused ? resume : pause}>
                    {isPaused ? <><Play size={16}/>Resume</> : <><Pause size={16}/>Pause</>}
                </Button>
                <Button variant="ghost" onClick={clear}>Clear</Button>
                <span className="ml-auto flex items-center gap-2 font-mono text-xs text-ink-2">
                    concurrency
                    {[1, 2, 3, 4].map((n) => (
                        <Button key={n} size="sm" variant={n === concurrency ? 'primary' : 'secondary'} onClick={() => setConcurrency(n)}>
                            {n}
                        </Button>
                    ))}
                </span>
            </Row>

            <div className="mb-4 grid gap-2" style={{gridTemplateColumns: `repeat(${concurrency}, minmax(0, 1fr))`}}>
                {Array.from({length: Math.max(concurrency, active.length)}, (_, lane) => {
                    const task = active[lane];
                    if (!task) {
                        return (
                            <div key={`idle-${lane}`}
                                 className="flex h-20 items-center justify-center rounded-xl border border-dashed border-line-strong font-mono text-xs text-ink-3">
                                lane {lane + 1} {isPaused ? 'paused' : 'idle'}
                            </div>
                        );
                    }
                    const total = planned.current.get(task.label) ?? 1;
                    const elapsed = Math.min(total, now - (task.startedAt ?? now));
                    return (
                        <div key={task.id} className="h-20 rounded-xl border border-accent bg-paper/80 p-3">
                            <div className="mb-2 truncate font-mono text-xs text-ink">{task.label}</div>
                            <Meter value={elapsed} max={total}/>
                            <div className="mt-1 font-mono text-[10px] tabular-nums text-ink-3">
                                {(elapsed / 1000).toFixed(1)}s / {(total / 1000).toFixed(1)}s
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-line bg-paper/70 p-3">
                    <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">Waiting ({waiting.length})</div>
                    <div className="flex max-h-40 flex-wrap gap-1.5 overflow-auto">
                        {waiting.length === 0 && <span className="text-xs text-ink-3">Nothing waiting.</span>}
                        {waiting.map((t) => (
                            <span key={t.id} className="rounded-md border border-line-strong px-2 py-0.5 font-mono text-[11px] text-ink-2">{t.label}</span>
                        ))}
                    </div>
                </div>
                <div className="rounded-xl border border-line bg-paper/70 p-3">
                    <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">Finished</div>
                    <ol className="max-h-40 space-y-1 overflow-auto font-mono text-xs">
                        {finished.length === 0 && <li className="text-ink-3">Nothing finished yet.</li>}
                        {finished.map((t) => (
                            <li key={t.id} className="flex justify-between gap-2">
                                <span className={cn('truncate', t.status === 'failed' ? 'text-danger' : 'text-ink')}>
                                    {t.status === 'failed' ? 'failed' : 'done'}  {t.label}
                                </span>
                                <span className="shrink-0 tabular-nums text-ink-3">{((t.duration ?? 0) / 1000).toFixed(2)}s</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
            <Note className="mt-2">About one upload in seven fails on purpose. Lowering the concurrency never stops a running upload.</Note>

            <ReadoutGrid cols={4} className="mt-6">
                <Readout label="running" value={`${running} / ${concurrency}`} live={running > 0}/>
                <Readout label="pending" value={pending}/>
                <Readout label="done" value={done} tone="ok"/>
                <Readout label="failed" value={failed} tone={failed ? 'danger' : 'default'}/>
            </ReadoutGrid>
        </Stage>
    );
}
