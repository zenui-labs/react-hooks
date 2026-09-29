'use client'

import {useState} from 'react';
import {Heart} from 'lucide-react';
import {useOptimisticState} from '@zenuilabs/react-hooks';
import {Button, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';
import {cn} from '@/lib/cn';

const LATENCY = 1200;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function UseOptimisticStateDemo() {
    // The "server" copy. In a real app this comes from your data layer.
    const [serverLikes, setServerLikes] = useState(128);
    const [failNext, setFailNext] = useState(false);
    const [log, setLog] = useState<string[]>([]);
    const push = (line: string) => setLog((current) => [line, ...current].slice(0, 20));

    const {value: likes, isPending, error, update} = useOptimisticState(
        serverLikes,
        (count: number, delta: number) => count + delta
    );

    const like = async () => {
        const shouldFail = failNext;
        push(`click: showing ${likes + 1} now, request sent`);
        const ok = await update(1, async () => {
            await sleep(LATENCY);
            if (shouldFail) throw new Error('503 Service Unavailable');
            setServerLikes((n) => n + 1);
        });
        push(ok ? 'server confirmed +1' : 'server rejected: rolled back');
    };

    return (
        <Stage>
            <StageHeader
                title="Instant like button"
                hint={`The count updates on click. The server answers after ${LATENCY / 1000} seconds; a failure rolls the count back. Click several times quickly.`}
            />

            <div className="mb-5 flex flex-wrap items-center gap-6">
                <button
                    type="button"
                    onClick={like}
                    className={cn(
                        'inline-flex h-14 items-center gap-3 rounded-full border px-6 font-mono text-xl tabular-nums transition-colors active:translate-y-px',
                        isPending ? 'border-accent bg-accent-soft text-ink' : 'border-line-strong bg-paper text-ink hover:border-ink'
                    )}
                >
                    <Heart size={20} className={cn(isPending && 'fill-accent text-accent')}/>
                    {likes}
                </button>
                <div className="font-mono text-xs text-ink-2">
                    <div>shown: <span className="text-ink">{likes}</span></div>
                    <div>server: <span className="text-ink">{serverLikes}</span></div>
                    <div>in flight: <span className="text-ink">{likes - serverLikes}</span></div>
                </div>
            </div>

            <Row className="mb-4">
                <Button size="sm" variant={failNext ? 'danger' : 'secondary'} onClick={() => setFailNext((f) => !f)}>
                    {failNext ? 'Server will fail' : 'Make the server fail'}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setServerLikes((n) => n + 10)}>
                    Someone else adds 10
                </Button>
            </Row>

            <Log entries={log} empty="Click the heart."/>

            <ReadoutGrid cols={4} className="mt-6">
                <Readout label="value" value={likes} tone="accent"/>
                <Readout label="server value" value={serverLikes}/>
                <Readout label="isPending" value={String(isPending)} live={isPending}/>
                <Readout label="error" value={error ? error.message : 'null'} tone={error ? 'danger' : 'default'}/>
            </ReadoutGrid>
            <Note className="mt-3">
                Someone else adds 10 changes the confirmed value while likes are in flight. Pending likes stay applied on
                top of the new value.
            </Note>
        </Stage>
    );
}
