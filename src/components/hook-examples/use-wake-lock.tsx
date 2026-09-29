'use client'

import React, {useEffect, useRef, useState} from 'react';
import {Coffee} from 'lucide-react';
import {useWakeLock} from '@zenuilabs/react-hooks';
import {Button, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader, Unsupported} from '@/components/demo';

function stamp() {
    return new Date().toLocaleTimeString();
}

export default function UseWakeLockDemo() {
    const {isSupported, isActive, error, request, release} = useWakeLock();
    const [log, setLog] = useState<string[]>([]);
    const [heldFor, setHeldFor] = useState(0);
    const wanted = useRef(false);
    const previous = useRef(isActive);

    const add = (entry: string) => setLog((prev) => [`${stamp()}  ${entry}`, ...prev].slice(0, 20));

    useEffect(() => {
        if (previous.current === isActive) return;
        previous.current = isActive;
        if (isActive) add('lock acquired, screen stays on');
        else if (wanted.current) add('lock dropped by the browser (tab hidden), will re-acquire');
        else add('lock released');
    }, [isActive]);

    useEffect(() => {
        const onVisibility = () => add(`tab ${document.visibilityState}`);
        document.addEventListener('visibilitychange', onVisibility);
        return () => document.removeEventListener('visibilitychange', onVisibility);
    }, []);

    useEffect(() => {
        if (!isActive) return;
        const started = Date.now();
        setHeldFor(0);
        const id = setInterval(() => setHeldFor(Math.floor((Date.now() - started) / 1000)), 1000);
        return () => clearInterval(id);
    }, [isActive]);

    const toggle = () => {
        wanted.current = !isActive;
        void (isActive ? release() : request());
    };

    return (
        <Stage>
            <StageHeader
                title="Keep the screen on"
                hint="Acquire the lock, switch to another tab for a moment, then come back. The browser drops the lock while hidden and the hook takes it again."
                live={isActive}
            />

            {!isSupported ? (
                <Unsupported api="navigator.wakeLock"/>
            ) : (
                <>
                    <Row>
                        <Button onClick={toggle}>
                            <Coffee className="size-4"/>
                            {isActive ? 'Release lock' : 'Keep screen on'}
                        </Button>
                    </Row>
                    <ReadoutGrid cols={3} className="mt-5">
                        <Readout label="isActive" value={String(isActive)} live={isActive} tone={isActive ? 'ok' : 'default'}/>
                        <Readout label="held for" value={isActive ? `${heldFor}s` : '-'}/>
                        <Readout label="error" value={error ? error.name : 'null'} tone={error ? 'danger' : 'default'}/>
                    </ReadoutGrid>
                    <div className="mt-4">
                        <Log entries={log} empty="Nothing yet. Acquire the lock to start."/>
                    </div>
                    <Note className="mt-3">
                        The lock is also released when this demo unmounts. Battery saver modes can refuse the request.
                    </Note>
                </>
            )}
        </Stage>
    );
}
