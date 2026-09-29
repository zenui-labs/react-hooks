'use client'

import React, {useCallback, useEffect, useState} from 'react';
import {RefreshCcw} from 'lucide-react';
import {useIsClient} from '@zenuilabs/react-hooks';
import {Button, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

function LocalClock({onCommit}: { onCommit: (isClient: boolean) => void }) {
    const isClient = useIsClient();

    useEffect(() => {
        onCommit(isClient);
    }, [isClient, onCommit]);

    return (
        <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-paper/70 p-4">
                <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">Rendered markup</div>
                <div className="mt-2 font-mono text-lg text-ink">
                    {isClient
                        ? new Date().toLocaleString(undefined, {dateStyle: 'medium', timeStyle: 'medium'})
                        : 'Loading local time...'}
                </div>
                <div className="mt-1 text-xs text-ink-3">
                    {isClient ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Same text the server would send'}
                </div>
            </div>
            <ReadoutGrid cols={2}>
                <Readout label="isClient" value={String(isClient)} tone={isClient ? 'ok' : 'accent'} live={isClient}/>
                <Readout label="source" value={isClient ? 'browser' : 'server-safe'}/>
            </ReadoutGrid>
        </div>
    );
}

export default function UseIsClientDemo() {
    const [mountKey, setMountKey] = useState(0);
    const [log, setLog] = useState<string[]>([]);

    const onCommit = useCallback((isClient: boolean) => {
        setLog((prev) => {
            const entry = isClient
                ? 'commit 2: isClient = true, render browser-only content'
                : 'commit 1: isClient = false, matches the server HTML';
            // Strict Mode replays the mount effect; keep one line per commit.
            return prev[0] === entry ? prev : [entry, ...prev].slice(0, 10);
        });
    }, []);

    return (
        <Stage>
            <StageHeader
                title="Server first, then browser"
                hint="The first render must match the server HTML, so isClient starts false and flips after mount. Remount to replay it."
            />

            <Row className="mb-5">
                <Button
                    variant="secondary"
                    onClick={() => {
                        setLog((prev) => ['-- remount --', ...prev]);
                        setMountKey((k) => k + 1);
                    }}
                >
                    <RefreshCcw className="size-4"/>Remount
                </Button>
            </Row>

            <LocalClock key={mountKey} onCommit={onCommit}/>

            <div className="mt-4">
                <Log entries={log}/>
            </div>
            <Note className="mt-3">
                Reading the time zone during the first render would produce different text on the server and in the
                browser, and React would report a hydration mismatch.
            </Note>
        </Stage>
    );
}
