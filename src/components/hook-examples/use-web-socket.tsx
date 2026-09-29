'use client'

import React, {useState} from 'react';
import {useWebSocket} from '@zenuilabs/react-hooks';
import {Send, Unplug} from 'lucide-react';
import {Button, Input, Led, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader, Unsupported} from '@/components/demo';

const ECHO_URL = 'wss://echo.websocket.org';

type Line = { from: 'you' | 'echo' | 'system'; text: string };

export default function UseWebSocketDemo() {
    const [enabled, setEnabled] = useState(true);
    const [draft, setDraft] = useState('');
    const [lines, setLines] = useState<Line[]>([]);

    const push = (line: Line) => setLines((prev) => [line, ...prev].slice(0, 40));

    const {status, lastMessage, send, close, reconnect, reconnectAttempt, getSocket, isSupported} = useWebSocket<string>(
        enabled ? ECHO_URL : null,
        {
            parse: (data) => String(data),
            reconnect: {attempts: 5, delay: (attempt) => attempt * 1000},
            onOpen: () => push({from: 'system', text: 'Connected'}),
            onMessage: (text) => push({from: 'echo', text}),
            onClose: (event) => push({from: 'system', text: `Closed with code ${event.code}`}),
        }
    );

    if (!isSupported) return <Unsupported api="WebSocket"/>;

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        const text = draft.trim();
        if (!text) return;
        const accepted = send(text);
        const note = !accepted ? ' (dropped, socket closed)' : status === 'open' ? '' : ' (queued)';
        push({from: 'you', text: text + note});
        setDraft('');
    };

    const drop = () => {
        // Close the raw socket behind the hook's back, the way a network drop would.
        getSocket()?.close(4000, 'Simulated drop');
        push({from: 'system', text: 'Connection dropped'});
    };

    const live = status === 'open';
    const retrying = status !== 'open' && reconnectAttempt > 0;

    return (
        <Stage>
            <StageHeader
                title="Echo chat"
                hint="Messages go to a public echo server and come straight back. Drop the connection to watch the hook reconnect and flush anything you sent while it was down."
            />

            <form onSubmit={submit}>
                <Row>
                    <Input
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        placeholder="Type a message"
                        className="min-w-0 flex-1"
                        aria-label="Message"
                    />
                    <Button type="submit"><Send size={16}/> Send</Button>
                </Row>
            </form>

            <Row className="mt-3">
                <Button variant="secondary" size="sm" onClick={drop} disabled={status !== 'open'}>
                    <Unplug size={14}/> Drop connection
                </Button>
                <Button variant="secondary" size="sm" onClick={() => close()} disabled={status === 'closed' || status === 'idle'}>
                    Close
                </Button>
                <Button variant="ghost" size="sm" onClick={reconnect} disabled={!enabled}>
                    Reconnect
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEnabled((on) => !on)}>
                    {enabled ? 'Set url to null' : 'Set url'}
                </Button>
                <span className="ml-auto">
                    <Led on={live} tone={retrying ? 'danger' : undefined} label={retrying ? `Retry ${reconnectAttempt}/5` : status}/>
                </span>
            </Row>

            <Log
                className="mt-4"
                empty="Connecting to the echo server..."
                entries={lines.map((line, i) => (
                    <span key={i}>
                        <span className={line.from === 'you' ? 'text-accent' : line.from === 'system' ? 'text-ink-3' : 'text-ink'}>
                            {line.from}
                        </span>{' '}
                        {line.text}
                    </span>
                ))}
            />

            <ReadoutGrid cols={3} className="mt-4">
                <Readout label="status" value={status} live={live} tone={retrying ? 'danger' : 'default'}/>
                <Readout label="reconnectAttempt" value={reconnectAttempt}/>
                <Readout label="lastMessage" value={lastMessage ?? 'null'} tone="accent"/>
            </ReadoutGrid>

            <Note className="mt-4">
                Close ends the connection on purpose, so the hook does not reconnect. A drop is unexpected, so it
                retries up to 5 times with a delay of 1s, 2s, 3s and so on.
            </Note>
        </Stage>
    );
}
