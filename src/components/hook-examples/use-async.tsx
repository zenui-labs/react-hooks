'use client'

import {useCallback, useRef, useState} from 'react';
import {useAsync} from '@zenuilabs/react-hooks';
import {Button, Led, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

interface Quote {
    call: number;
    latency: number;
}

export default function UseAsyncDemo() {
    const [entries, setEntries] = useState<string[]>([]);
    const calls = useRef(0);
    const failNext = useRef(false);

    const log = (line: string) => setEntries(prev => [line, ...prev].slice(0, 30));

    // A fake request with a random latency, so later calls can finish first.
    const getQuote = useCallback((): Promise<Quote> => {
        const call = ++calls.current;
        const latency = 300 + Math.round(Math.random() * 1500);
        const shouldFail = failNext.current;
        failNext.current = false;
        log(`call ${call} started, takes ${latency} ms`);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (shouldFail) {
                    log(`call ${call} failed`);
                    reject(new Error(`Call ${call} failed`));
                } else {
                    log(`call ${call} finished`);
                    resolve({call, latency});
                }
            }, latency);
        });
    }, []);

    const {data, loading, error, execute, reset} = useAsync(getQuote, false);

    return (
        <Stage>
            <StageHeader
                title="Latest call wins"
                hint="Click Run several times quickly. Calls finish in random order, but only the most recent one updates state."
                live={loading}
            />
            <div className="space-y-4">
                <Row>
                    <Button onClick={() => execute()}>Run</Button>
                    <Button variant="secondary" onClick={() => { failNext.current = true; execute(); }}>Run and fail</Button>
                    <Button variant="ghost" onClick={reset}>reset()</Button>
                    <Led on={loading} label={loading ? 'Loading' : 'Idle'}/>
                </Row>
                <ReadoutGrid>
                    <Readout label="data" value={data ? `call ${data.call}` : 'null'} tone="accent"/>
                    <Readout label="loading" value={String(loading)} live={loading}/>
                    <Readout label="error" value={error instanceof Error ? error.message : 'null'} tone={error ? 'danger' : 'default'}/>
                </ReadoutGrid>
                <Log entries={entries} empty="Run a call to see it here."/>
                <Note>A finished call that is not the latest is ignored, so data always matches the last click.</Note>
            </div>
        </Stage>
    );
}
