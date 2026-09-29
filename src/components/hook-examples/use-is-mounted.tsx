'use client'

import React, {useCallback, useEffect, useState} from 'react';
import {useIsMounted} from '@zenuilabs/react-hooks';
import {Button, Log, Meter, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const DURATION = 3000;

type Report = (entry: string) => void;

function fakeRequest() {
    return new Promise<{ name: string }>((resolve) => setTimeout(() => resolve({name: 'Ada Lovelace'}), DURATION));
}

function Profile({report, onPending}: { report: Report; onPending: (startedAt: number | null) => void }) {
    const isMounted = useIsMounted();
    const [name, setName] = useState<string | null>(null);

    const load = async () => {
        report('request started (3s)');
        onPending(Date.now());
        const user = await fakeRequest();
        const mounted = isMounted();
        onPending(null);
        if (!mounted) {
            report('request finished, isMounted() = false, result dropped, no setState');
            return;
        }
        report('request finished, isMounted() = true, setName called');
        setName(user.name);
    };

    return (
        <div className="rounded-xl border border-accent/40 bg-accent-soft p-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">Profile (mounted)</div>
            <div className="mt-2 text-lg text-ink">{name ?? 'Not loaded'}</div>
            <Button size="sm" className="mt-3" onClick={load}>Load profile</Button>
        </div>
    );
}

export default function UseIsMountedDemo() {
    const [show, setShow] = useState(true);
    const [log, setLog] = useState<string[]>([]);
    const [startedAt, setStartedAt] = useState<number | null>(null);
    const [elapsed, setElapsed] = useState(0);

    const report = useCallback<Report>((entry) => {
        setLog((prev) => [`${new Date().toLocaleTimeString()}  ${entry}`, ...prev].slice(0, 12));
    }, []);

    useEffect(() => {
        if (startedAt === null) return;
        let frame = requestAnimationFrame(function tick() {
            setElapsed(Date.now() - startedAt);
            frame = requestAnimationFrame(tick);
        });
        return () => cancelAnimationFrame(frame);
    }, [startedAt]);

    const toggle = () => {
        report(show ? 'Profile unmounted' : 'Profile mounted');
        setShow((s) => !s);
    };

    return (
        <Stage>
            <StageHeader
                title="Late responses after unmount"
                hint="Press Load profile, then unmount the component before the 3 second request returns. The response arrives, the guard sees the component is gone, and nothing touches its state."
                live={startedAt !== null}
            />

            <Row className="mb-4">
                <Button variant="secondary" onClick={toggle}>{show ? 'Unmount profile' : 'Mount profile'}</Button>
            </Row>

            {show ? (
                <Profile report={report} onPending={setStartedAt}/>
            ) : (
                <div className="rounded-xl border border-dashed border-line-strong p-4 text-sm text-ink-3">
                    Profile is unmounted.
                </div>
            )}

            <div className="mt-5">
                <Meter value={startedAt === null ? 0 : Math.min(elapsed, DURATION)} max={DURATION} label="request in flight"/>
            </div>

            <ReadoutGrid cols={2} className="mt-5">
                <Readout label="profile mounted" value={String(show)} tone={show ? 'ok' : 'default'}/>
                <Readout label="request pending" value={String(startedAt !== null)} live={startedAt !== null}/>
            </ReadoutGrid>
            <div className="mt-4">
                <Log entries={log} empty="Load the profile to start a request."/>
            </div>
            <Note className="mt-3">
                The same check stops follow-up work such as analytics calls, navigation or chained requests that
                make no sense once the user has left the screen.
            </Note>
        </Stage>
    );
}
