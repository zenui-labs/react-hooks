'use client'

import React, {useState} from 'react';
import {useEventSource, type EventSourceLike} from '@zenuilabs/react-hooks';
import {Button, Led, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

type Payload = { symbol?: string; price?: number; note?: string };

/*
 * A stand-in for a server. It behaves like the browser's EventSource: it opens after a short delay,
 * emits named "price" events plus unnamed keep-alive messages, and after a network error it reports
 * readyState CONNECTING and retries on its own.
 */
let activeStream: MockPriceStream | null = null;

class MockPriceStream extends EventTarget implements EventSourceLike {
    readyState = 0;
    private timers: Array<ReturnType<typeof setTimeout>> = [];
    private seq = 0;
    private price = 100;

    constructor(_url: string, _init?: EventSourceInit) {
        super();
        activeStream = this;
        this.connect(500);
    }

    private connect(after: number) {
        this.later(() => {
            this.readyState = 1;
            this.dispatchEvent(new Event('open'));
            this.tick();
        }, after);
    }

    private tick() {
        this.later(() => {
            this.seq += 1;
            if (this.seq % 5 === 0) {
                this.emit('message', {note: 'keep-alive'});
            } else {
                this.price = Math.max(1, this.price + (Math.random() - 0.48) * 2.5);
                this.emit('price', {symbol: 'ZEN', price: Number(this.price.toFixed(2))});
            }
            this.tick();
        }, 700 + Math.random() * 600);
    }

    private emit(type: string, data: Payload) {
        this.dispatchEvent(new MessageEvent(type, {data: JSON.stringify(data), lastEventId: String(this.seq)}));
    }

    private later(fn: () => void, ms: number) {
        this.timers.push(setTimeout(fn, ms));
    }

    private clear() {
        this.timers.forEach(clearTimeout);
        this.timers = [];
    }

    /** Simulate a network failure: error event, then the built-in retry. */
    drop() {
        if (this.readyState !== 1) return;
        this.clear();
        this.readyState = 0;
        this.dispatchEvent(new Event('error'));
        this.connect(2000);
    }

    close() {
        this.clear();
        this.readyState = 2;
        if (activeStream === this) activeStream = null;
    }
}

export default function UseEventSourceDemo() {
    const [enabled, setEnabled] = useState(true);
    const [log, setLog] = useState<string[]>([]);
    const add = (line: string) => setLog((prev) => [line, ...prev].slice(0, 30));

    const {status, lastEvent, error, close, reconnect} = useEventSource<Payload>(enabled ? '/api/prices' : null, {
        events: ['price'],
        parse: (data) => JSON.parse(data) as Payload,
        eventSourceClass: MockPriceStream,
        onOpen: () => add('open'),
        onError: () => add('error, the stream will retry'),
        onMessage: (event) => add(`#${event.id} ${event.type} ${JSON.stringify(event.data)}`),
    });

    const price = lastEvent?.type === 'price' ? lastEvent.data.price : undefined;

    return (
        <Stage>
            <StageHeader
                title="Price stream"
                hint="Named price events and unnamed keep-alive messages arrive over one stream. Drop the network to see the error, the automatic retry, and the stream resuming."
            />

            <Row>
                <Button onClick={() => activeStream?.drop()} disabled={status !== 'open'}>Drop network</Button>
                <Button variant="secondary" onClick={close} disabled={status === 'closed' || status === 'idle'}>Close</Button>
                <Button variant="ghost" onClick={reconnect} disabled={!enabled}>Reconnect</Button>
                <Button variant="ghost" onClick={() => setEnabled((on) => !on)}>
                    {enabled ? 'Set url to null' : 'Set url'}
                </Button>
                <span className="ml-auto">
                    <Led on={status === 'open'} tone={error && status !== 'open' ? 'danger' : undefined} label={status}/>
                </span>
            </Row>

            <div className="mt-5 flex items-baseline gap-3">
                <span className="font-mono text-sm text-ink-3">ZEN</span>
                <span className="font-display text-5xl font-semibold tabular-nums tracking-tight text-ink">
                    {price !== undefined ? price.toFixed(2) : '--.--'}
                </span>
            </div>

            <Log className="mt-4" entries={log} empty="Waiting for the stream to open..."/>

            <ReadoutGrid cols={4} className="mt-4">
                <Readout label="status" value={status} live={status === 'open'}/>
                <Readout label="lastEvent.type" value={lastEvent?.type ?? 'null'} tone="accent"/>
                <Readout label="lastEvent.id" value={lastEvent?.id ?? 'null'}/>
                <Readout label="error" value={error ? error.type : 'null'} tone={error ? 'danger' : 'default'}/>
            </ReadoutGrid>

            <Note className="mt-4">
                Server-Sent Events need a real HTTP endpoint, so this demo passes a small in-page mock through the
                <span className="font-mono"> eventSourceClass</span> option. It follows the EventSource contract,
                and the hook code is the same one that runs against a real server.
            </Note>
        </Stage>
    );
}
