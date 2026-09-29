'use client'

import React, {memo, useEffect, useRef, useState} from 'react';
import {useEventCallback} from '@zenuilabs/react-hooks';
import {Button, Field, Input, Log, Note, Stage, StageHeader} from '@/components/demo';
import {cn} from '@/lib/cn';

/**
 * A memoized child that counts its own commits. The count is written to the DOM
 * from an effect (so it never causes extra renders), and a per-render token skips
 * the replayed mount effect in Strict Mode.
 */
const SendButton = memo(function SendButton({label, tone, onSend}: {
    label: string;
    tone: 'danger' | 'ok';
    onSend: () => void;
}) {
    const count = useRef(0);
    const el = useRef<HTMLSpanElement | null>(null);
    const last = useRef<object | null>(null);
    const token = {};

    useEffect(() => {
        if (last.current === token) return;
        last.current = token;
        count.current += 1;
        if (el.current) {
            el.current.textContent = String(count.current);
            el.current.dataset.flash = 'false';
            void el.current.offsetWidth;
            el.current.dataset.flash = 'true';
        }
    });

    return (
        <div className="rounded-xl border border-line bg-paper/70 p-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">{label}</div>
            <div className="mt-2 flex items-baseline gap-2">
                <span
                    ref={el}
                    className={cn(
                        'rounded px-1 font-mono text-4xl tabular-nums data-[flash=true]:animate-flash',
                        tone === 'danger' ? 'text-danger' : 'text-ok'
                    )}
                />
                <span className="text-sm text-ink-2">renders</span>
            </div>
            <Button size="sm" variant="secondary" className="mt-3" onClick={onSend}>Send</Button>
        </div>
    );
});

export default function UseEventCallbackDemo() {
    const [message, setMessage] = useState('');
    const [log, setLog] = useState<string[]>([]);

    const send = (source: string) =>
        setLog((prev) => [`${source} sent "${message || '(empty)'}"`, ...prev].slice(0, 8));

    // New function every render: memo sees a changed prop on every keystroke.
    const inlineSend = () => send('inline');
    // Same function every render, but it still reads the latest message.
    const stableSend = useEventCallback(() => send('useEventCallback'));

    return (
        <Stage>
            <StageHeader
                title="Keep memoized children still"
                hint="Type in the box. Both buttons are wrapped in memo. The one given an inline function re-renders on every keystroke; the one given useEventCallback stays at 1."
            />

            <Field label="message">
                <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type here"/>
            </Field>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <SendButton label="onSend={() => send()}" tone="danger" onSend={inlineSend}/>
                <SendButton label="onSend={useEventCallback(send)}" tone="ok" onSend={stableSend}/>
            </div>

            <div className="mt-4">
                <Log entries={log} empty="Press Send on either card. Both send the latest message."/>
            </div>
            <Note className="mt-3">
                useCallback with [message] would also keep the value fresh, but its identity changes on every
                keystroke, so memo still re-renders. useEventCallback keeps one identity and calls the latest function.
            </Note>
        </Stage>
    );
}
