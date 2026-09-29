'use client'

import React, {useEffect, useState} from 'react';
import {useDocumentTitle} from '@zenuilabs/react-hooks';
import {Button, Field, Input, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

function InboxTab({unread, restoreOnUnmount}: { unread: number; restoreOnUnmount: boolean }) {
    useDocumentTitle(unread > 0 ? `(${unread}) Inbox` : 'Inbox', {restoreOnUnmount});
    return (
        <div className="rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-ink">
            Inbox is mounted and owns the tab title.
        </div>
    );
}

/** Watch the real document.title, whoever changes it. */
function useLiveTitle() {
    const [title, setTitle] = useState('');
    const [log, setLog] = useState<string[]>([]);

    useEffect(() => {
        let last = document.title;
        setTitle(last);
        const observer = new MutationObserver(() => {
            if (document.title === last) return;
            last = document.title;
            setTitle(last);
            setLog((prev) => [`${new Date().toLocaleTimeString()}  "${last}"`, ...prev].slice(0, 12));
        });
        observer.observe(document.head, {subtree: true, childList: true, characterData: true});
        return () => observer.disconnect();
    }, []);

    return {title, log};
}

export default function UseDocumentTitleDemo() {
    const [mounted, setMounted] = useState(false);
    const [unread, setUnread] = useState(3);
    const [restore, setRestore] = useState(true);
    const {title, log} = useLiveTitle();

    return (
        <Stage>
            <StageHeader
                title="Tab title"
                hint="Mount the inbox and look at your browser tab. Change the unread count, then unmount it and the original title comes back."
                live={mounted}
            />

            <Row>
                <Button onClick={() => setMounted((m) => !m)}>{mounted ? 'Unmount inbox' : 'Mount inbox'}</Button>
                <Button variant="secondary" onClick={() => setUnread((n) => n + 1)}>New message</Button>
                <Button variant="ghost" onClick={() => setUnread(0)}>Mark all read</Button>
            </Row>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Field label="unread">
                    <Input type="number" min={0} value={unread} onChange={(e) => setUnread(Math.max(0, Number(e.target.value)))}/>
                </Field>
                <label className="flex items-end gap-2 pb-2.5 text-sm text-ink-2">
                    <input
                        type="checkbox"
                        checked={restore}
                        onChange={(e) => setRestore(e.target.checked)}
                        className="size-4 accent-accent"
                    />
                    restoreOnUnmount
                </label>
            </div>

            {mounted && <div className="mt-4"><InboxTab unread={unread} restoreOnUnmount={restore}/></div>}

            <ReadoutGrid cols={2} className="mt-5">
                <Readout label="document.title" value={title} tone="accent" className="sm:col-span-2"/>
            </ReadoutGrid>
            <div className="mt-4">
                <Log entries={log} empty="Title changes show up here."/>
            </div>
            <Note className="mt-3">
                With restoreOnUnmount off, the last title stays after the inbox unmounts. Reload the page to reset it.
            </Note>
        </Stage>
    );
}
