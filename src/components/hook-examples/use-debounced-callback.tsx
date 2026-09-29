'use client'

import {useEffect, useState} from 'react';
import {useDebouncedCallback} from '@zenuilabs/react-hooks';
import {Button, Field, Input, Led, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const WINDOW = 6000;

function Strip({label, times, now, tone}: { label: string; times: number[]; now: number; tone: 'raw' | 'call' }) {
    return (
        <div className="flex items-center gap-3">
            <span className="w-16 shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">{label}</span>
            <div className="relative h-7 flex-1 overflow-hidden rounded-md border border-line bg-paper/80">
                {times.map((t, i) => {
                    const left = 100 - ((now - t) / WINDOW) * 100;
                    if (left < 0) return null;
                    return (
                        <span
                            key={`${t}-${i}`}
                            className={tone === 'raw'
                                ? 'absolute top-2 bottom-2 w-px bg-ink-3'
                                : 'absolute top-0.5 bottom-0.5 w-1 -translate-x-1/2 rounded-sm bg-accent'}
                            style={{left: `${left}%`}}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default function UseDebouncedCallbackDemo() {
    const [delay, setDelay] = useState(500);
    const [leading, setLeading] = useState(false);
    const [trailing, setTrailing] = useState(true);
    const [maxWait, setMaxWait] = useState<number | undefined>(undefined);
    const [text, setText] = useState('');
    const [query, setQuery] = useState('');
    const [raw, setRaw] = useState<number[]>([]);
    const [calls, setCalls] = useState<number[]>([]);
    const [now, setNow] = useState(() => Date.now());

    const search = useDebouncedCallback((value: string) => {
        setQuery(value);
        setCalls((list) => [...list.filter((t) => Date.now() - t < WINDOW), Date.now()]);
    }, delay, {leading, trailing, maxWait});

    useEffect(() => {
        let frame = requestAnimationFrame(function tick() {
            setNow(Date.now());
            frame = requestAnimationFrame(tick);
        });
        return () => cancelAnimationFrame(frame);
    }, []);

    const onChange = (value: string) => {
        setText(value);
        setRaw((list) => [...list.filter((t) => Date.now() - t < WINDOW), Date.now()]);
        search(value);
    };

    const pending = search.isPending();

    return (
        <Stage>
            <StageHeader
                title="Search as you type"
                hint="Type in bursts. Grey ticks are keystrokes; accent bars are calls to the debounced function. Try leading and maxWait."
            />

            <Field label="Search">
                <Input value={text} onChange={(e) => onChange(e.target.value)} placeholder="Type quickly, then pause"/>
            </Field>

            <div className="my-5 space-y-2">
                <Strip label="events" times={raw} now={now} tone="raw"/>
                <Strip label="calls" times={calls} now={now} tone="call"/>
                <div className="flex justify-between pl-[76px] font-mono text-[10px] text-ink-3">
                    <span>-6s</span><span>now</span>
                </div>
            </div>

            <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <div>
                    <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">delay</div>
                    <Row>
                        {[200, 500, 1000].map((ms) => (
                            <Button key={ms} size="sm" variant={delay === ms ? 'primary' : 'secondary'} onClick={() => setDelay(ms)}>
                                {ms} ms
                            </Button>
                        ))}
                    </Row>
                </div>
                <div>
                    <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">options</div>
                    <Row>
                        <Button size="sm" variant={leading ? 'primary' : 'secondary'} onClick={() => setLeading((v) => !v)}>
                            leading {leading ? 'on' : 'off'}
                        </Button>
                        <Button size="sm" variant={trailing ? 'primary' : 'secondary'} onClick={() => setTrailing((v) => !v)}>
                            trailing {trailing ? 'on' : 'off'}
                        </Button>
                        <Button size="sm" variant={maxWait ? 'primary' : 'secondary'}
                                onClick={() => setMaxWait((v) => (v ? undefined : 1500))}>
                            maxWait {maxWait ? '1500' : 'off'}
                        </Button>
                    </Row>
                </div>
            </div>

            <Row className="mb-2">
                <Button size="sm" variant="secondary" onClick={search.flush} disabled={!pending}>flush()</Button>
                <Button size="sm" variant="ghost" onClick={search.cancel} disabled={!pending}>cancel()</Button>
                <Led on={pending} label={pending ? 'Call scheduled' : 'Nothing scheduled'}/>
            </Row>
            <Note>flush runs the scheduled call now. cancel drops it.</Note>

            <ReadoutGrid cols={4} className="mt-6">
                <Readout label="keystrokes (6s)" value={raw.filter((t) => now - t < WINDOW).length}/>
                <Readout label="calls (6s)" value={calls.filter((t) => now - t < WINDOW).length} tone="accent"/>
                <Readout label="isPending()" value={String(pending)} live={pending}/>
                <Readout label="last query" value={query ? `"${query}"` : '""'}/>
            </ReadoutGrid>
        </Stage>
    );
}
