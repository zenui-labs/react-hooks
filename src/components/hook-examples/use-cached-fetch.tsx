'use client'

import {useEffect, useRef, useState} from 'react';
import {RefreshCw, Trash2} from 'lucide-react';
import {clearCachedFetch, useCachedFetch} from '@zenuilabs/react-hooks';
import {Button, Led, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';
import {cn} from '@/lib/cn';

interface User {
    id: number;
    name: string;
    email: string;
    company: { name: string };
}

const TTL = 15_000;
const stamp = () => new Date().toLocaleTimeString([], {hour12: false}) + '.' + String(Date.now() % 1000).padStart(3, '0');

function UserCard({userKey, label}: { userKey: string; label: string }) {
    const {data, isLoading, isValidating} = useCachedFetch<User>(userKey, fetchUser, {ttl: TTL, dedupeInterval: 1000});
    return (
        <div className="rounded-xl border border-line bg-paper/70 p-3">
            <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                <span>{label}</span>
                <span className="led" data-on={isValidating}/>
            </div>
            {isLoading ? (
                <div className="space-y-2">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-panel-2"/>
                    <div className="h-3 w-1/2 animate-pulse rounded bg-panel-2"/>
                </div>
            ) : data ? (
                <div className={cn('transition-opacity', isValidating && 'opacity-70')}>
                    <div className="text-sm font-medium text-ink">{data.name}</div>
                    <div className="font-mono text-xs text-ink-3">{data.email}</div>
                    <div className="text-xs text-ink-2">{data.company.name}</div>
                </div>
            ) : null}
        </div>
    );
}

// Network log shared by the fetcher (module level so both cards report into it).
let pushNetwork: ((line: string) => void) | null = null;

async function fetchUser(key: string): Promise<User> {
    pushNetwork?.(`${stamp()}  network  GET ${key.replace('https://jsonplaceholder.typicode.com', '')}`);
    const response = await fetch(key);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

export default function UseCachedFetchDemo() {
    const [id, setId] = useState(1);
    const [showSecond, setShowSecond] = useState(false);
    const [log, setLog] = useState<string[]>([]);
    const [requests, setRequests] = useState(0);
    const [now, setNow] = useState(() => Date.now());
    const key = `https://jsonplaceholder.typicode.com/users/${id}`;
    const {data, error, isLoading, isValidating, updatedAt, mutate, revalidate} =
        useCachedFetch<User>(key, fetchUser, {ttl: TTL, dedupeInterval: 1000});

    const push = (line: string) => setLog((current) => [line, ...current].slice(0, 40));

    useEffect(() => {
        pushNetwork = (line) => {
            setRequests((n) => n + 1);
            push(line);
        };
        return () => {
            pushNetwork = null;
        };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 250);
        return () => clearInterval(timer);
    }, []);

    // The cache is read synchronously during render, so on a key change `data` is either there or not.
    const loggedId = useRef<number | null>(null);
    useEffect(() => {
        if (loggedId.current === id) return;
        loggedId.current = id;
        push(`${stamp()}  ${data !== undefined ? 'cache hit ' : 'cache miss'}  /users/${id}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const age = updatedAt ? Math.max(0, now - updatedAt) : null;
    const fresh = age !== null && age < TTL;

    return (
        <Stage>
            <StageHeader
                title="Stale-while-revalidate"
                hint="Switch users. The first visit goes to the network; coming back renders from the cache instantly, then revalidates once the entry is older than 15 seconds."
            />

            <Row className="mb-4">
                {[1, 2, 3, 4, 5].map((n) => (
                    <Button key={n} size="sm" variant={n === id ? 'primary' : 'secondary'} onClick={() => setId(n)}>
                        User {n}
                    </Button>
                ))}
            </Row>

            <div className="mb-4 grid gap-3 md:grid-cols-2">
                <UserCard userKey={key} label="Card A"/>
                {showSecond ? (
                    <UserCard userKey={key} label="Card B (same key)"/>
                ) : (
                    <button type="button" onClick={() => setShowSecond(true)}
                            className="rounded-xl border-2 border-dashed border-line-strong p-3 text-sm text-ink-2 hover:border-ink hover:text-ink">
                        Mount a second consumer. It renders from the shared cache without a request.
                    </button>
                )}
            </div>

            <Row className="mb-4">
                <Button variant="secondary" size="sm" disabled={!data}
                        onClick={() => {
                            push(`${stamp()}  mutate    local rename, no revalidate`);
                            void mutate((u) => ({...u!, name: `${u!.name.split(' (')[0]} (edited)`}), {revalidate: false});
                        }}>
                    Rename locally
                </Button>
                <Button variant="secondary" size="sm" onClick={() => void revalidate()}>
                    <RefreshCw size={14}/>Revalidate
                </Button>
                <Button variant="ghost" size="sm" onClick={() => {
                    push(`${stamp()}  clear     cache emptied`);
                    clearCachedFetch();
                }}>
                    <Trash2 size={14}/>Clear cache
                </Button>
                <Led on={isValidating} label={isValidating ? 'Validating' : 'Idle'}/>
            </Row>

            <Log entries={log} empty="Requests and cache hits are logged with timestamps."/>
            {error && <p className="mt-2 font-mono text-xs text-danger">{error.message}</p>}

            <ReadoutGrid cols={4} className="mt-6">
                <Readout label="isLoading" value={String(isLoading)}/>
                <Readout label="isValidating" value={String(isValidating)} live={isValidating}/>
                <Readout label="cache age" value={age === null ? 'none' : `${(age / 1000).toFixed(1)}s`}
                         tone={age === null ? 'default' : fresh ? 'ok' : 'danger'}/>
                <Readout label="network requests" value={requests} tone="accent"/>
            </ReadoutGrid>
            <Note className="mt-3">
                Cache age turns red when the entry is stale (older than the 15 second ttl). Switching tabs and coming back
                also revalidates stale entries.
            </Note>
        </Stage>
    );
}
