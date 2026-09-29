'use client'

import React, {useState} from 'react';
import {Share2} from 'lucide-react';
import {useShare} from '@zenuilabs/react-hooks';
import {Button, Field, Input, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader, Unsupported} from '@/components/demo';

export default function UseShareDemo() {
    const {isSupported, isSharing, error, canShare, share} = useShare();
    const [title, setTitle] = useState('Weekend hiking route');
    const [text, setText] = useState('12 km loop with a lake at the halfway point.');
    const [url, setUrl] = useState('https://react-hooks.zenui.net/hooks/useshare');
    const [log, setLog] = useState<string[]>([]);

    const data = {title, text, url};
    const shareable = canShare(data);

    const onShare = async () => {
        const shared = await share(data);
        setLog((prev) => [
            `${new Date().toLocaleTimeString()}  share() resolved ${shared}${shared ? '' : ' (cancelled or failed)'}`,
            ...prev,
        ].slice(0, 12));
    };

    return (
        <Stage>
            <StageHeader
                title="Native share sheet"
                hint="Edit the payload and press Share. Close the sheet without choosing an app to see that a cancel is not an error."
                live={isSharing}
            />

            {!isSupported && <div className="mb-4"><Unsupported api="navigator.share"/></div>}

            <div className="grid gap-3 md:grid-cols-3">
                <Field label="title"><Input value={title} onChange={(e) => setTitle(e.target.value)}/></Field>
                <Field label="text"><Input value={text} onChange={(e) => setText(e.target.value)}/></Field>
                <Field label="url"><Input value={url} onChange={(e) => setUrl(e.target.value)}/></Field>
            </div>

            <Row className="mt-4">
                <Button onClick={onShare} disabled={!isSupported || isSharing}>
                    <Share2 className="size-4"/>
                    {isSharing ? 'Sheet open' : 'Share'}
                </Button>
            </Row>

            <ReadoutGrid cols={4} className="mt-5">
                <Readout label="isSupported" value={String(isSupported)} tone={isSupported ? 'ok' : 'danger'}/>
                <Readout label="canShare(data)" value={String(shareable)}/>
                <Readout label="isSharing" value={String(isSharing)} live={isSharing}/>
                <Readout label="error" value={error ? error.name : 'null'} tone={error ? 'danger' : 'default'}/>
            </ReadoutGrid>
            <div className="mt-4">
                <Log entries={log}/>
            </div>
            <Note className="mt-3">
                An invalid URL makes canShare return false. Web Share works on most phones, Safari, and Chrome on
                Windows and ChromeOS.
            </Note>
        </Stage>
    );
}
