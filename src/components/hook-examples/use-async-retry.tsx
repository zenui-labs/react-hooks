'use client'

import {useCallback, useRef, useState} from 'react';
import {useAsyncRetry} from '@zenuilabs/react-hooks';
import {Button, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';
import {cn} from '@/lib/cn';

const MAX_ATTEMPTS = 4;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Attempt = { n: number; at: number; status: 'running' | 'failed' | 'ok' };

export default function UseAsyncRetryDemo() {
    const [failFirst, setFailFirst] = useState(2);
    const [backoff, setBackoff] = useState<'fixed' | 'exponential'>('exponential');
    const [attemptLog, setAttemptLog] = useState<Attempt[]>([]);
    const [log, setLog] = useState<string[]>([]);
    const counter = useRef(0);
    const startedAt = useRef(0);
    const runId = useRef(0);

    // A flaky "request": fails the first `failFirst` attempts, then succeeds.
    // `run` is passed through execute(...args) so late attempts from an older run are ignored here too.
    const request = useCallback(async (run: number) => {
        if (run !== runId.current) throw new Error('Superseded');
        const n = ++counter.current;
        const at = Date.now() - startedAt.current;
        setAttemptLog((list) => [...list, {n, at, status: 'running'}]);
        await sleep(500);
        if (run !== runId.current) throw new Error('Superseded');
        const ok = n > failFirst;
        setAttemptLog((list) => list.map((a) => a.n === n ? {...a, status: ok ? 'ok' : 'failed'} : a));
        setLog((l) => [`+${((Date.now() - startedAt.current) / 1000).toFixed(2)}s  attempt ${n} ${ok ? 'succeeded' : 'failed'}`, ...l].slice(0, 20));
        if (!ok) throw new Error(`Server error on attempt ${n}`);
        return {order: 1042, status: 'confirmed'};
    }, [failFirst]);

    const delay = backoff === 'fixed' ? 800 : (attempt: number) => 250 * 2 ** attempt;
    const {data, error, loading, attempts, execute, reset} = useAsyncRetry(request, false, MAX_ATTEMPTS, delay);

    const run = () => {
        counter.current = 0;
        startedAt.current = Date.now();
        setAttemptLog([]);
        setLog([]);
        void execute(++runId.current);
    };

    const waits = Array.from({length: MAX_ATTEMPTS - 1}, (_, i) => typeof delay === 'number' ? delay : delay(i + 1));

    return (
        <Stage>
            <StageHeader
                title="Flaky checkout"
                hint={`The request fails a set number of times before it succeeds. The hook makes up to ${MAX_ATTEMPTS} attempts, waiting between them.`}
            />

            <div className="mb-4 grid gap-4 md:grid-cols-2">
                <div>
                    <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">Server fails first</div>
                    <Row>
                        {[0, 1, 2, 3, 4].map((n) => (
                            <Button key={n} size="sm" variant={failFirst === n ? 'primary' : 'secondary'} onClick={() => setFailFirst(n)}>
                                {n}
                            </Button>
                        ))}
                    </Row>
                </div>
                <div>
                    <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">Retry delay</div>
                    <Row>
                        <Button size="sm" variant={backoff === 'fixed' ? 'primary' : 'secondary'} onClick={() => setBackoff('fixed')}>
                            Fixed 800 ms
                        </Button>
                        <Button size="sm" variant={backoff === 'exponential' ? 'primary' : 'secondary'} onClick={() => setBackoff('exponential')}>
                            250 * 2^n ms
                        </Button>
                    </Row>
                    <Note className="mt-1.5">Waits: {waits.map((w) => `${w} ms`).join(', ')}</Note>
                </div>
            </div>

            <Row className="mb-5">
                <Button onClick={run}>{loading ? 'Restart checkout' : 'Place order'}</Button>
                <Button variant="ghost" onClick={() => { runId.current++; setAttemptLog([]); setLog([]); reset(); }} disabled={!loading && attempts === 0}>Reset</Button>
            </Row>

            <div className="mb-4 flex min-h-14 items-center gap-2 overflow-x-auto rounded-xl border border-line bg-paper/70 p-3">
                {attemptLog.length === 0 && <span className="text-sm text-ink-3">Attempts appear here.</span>}
                {attemptLog.map((a, i) => (
                    <div key={a.n} className="flex shrink-0 items-center gap-2">
                        {i > 0 && (
                            <span className="font-mono text-[10px] text-ink-3">
                                wait {typeof delay === 'number' ? delay : delay(i)} ms
                            </span>
                        )}
                        <span
                            className={cn(
                                'rounded-lg border px-2.5 py-1 font-mono text-xs',
                                a.status === 'running' && 'animate-pulse border-accent text-ink',
                                a.status === 'failed' && 'border-danger/50 text-danger',
                                a.status === 'ok' && 'border-accent bg-accent text-accent-ink'
                            )}
                        >
                            #{a.n} {a.status}
                        </span>
                    </div>
                ))}
            </div>

            <Log entries={log} empty="Each attempt is logged with its time since the first one."/>

            <ReadoutGrid cols={4} className="mt-6">
                <Readout label="loading" value={String(loading)} live={loading}/>
                <Readout label="attempts" value={`${attempts} / ${MAX_ATTEMPTS}`} tone="accent"/>
                <Readout label="data" value={data ? `#${data.order} ${data.status}` : 'null'} tone={data ? 'ok' : 'default'}/>
                <Readout label="error" value={error ? error.message : 'null'} tone={error ? 'danger' : 'default'}/>
            </ReadoutGrid>
            <Note className="mt-3">
                Restarting while a retry is waiting cancels the old run, so its late results are ignored.
            </Note>
        </Stage>
    );
}
