'use client'

import {useState} from 'react';
import {Check, Copy} from 'lucide-react';
import {useCopyToClipboard} from '@zenuilabs/react-hooks';
import {Button, Field, Input, Log, Readout, ReadoutGrid, Row, Stage, StageHeader, Textarea} from '@/components/demo';

export default function UseCopyToClipboardDemo() {
    const {isCopied, copyToClipboard, error} = useCopyToClipboard();
    const [text, setText] = useState('npm install @zenuilabs/react-hooks');
    const [log, setLog] = useState<string[]>([]);

    const copy = async () => {
        const ok = await copyToClipboard(text);
        const time = new Date().toLocaleTimeString();
        setLog((entries) => [`${time}  ${ok ? 'copied' : 'failed'}  "${text.slice(0, 40)}"`, ...entries].slice(0, 8));
    };

    return (
        <Stage>
            <StageHeader
                title="Copy, then paste"
                hint="Copy the text, then paste it into the box below. isCopied switches on for two seconds and each new copy restarts the timer."
                live={isCopied}
            />
            <div className="space-y-4">
                <Field label="Text to copy">
                    <Row className="flex-nowrap">
                        <Input value={text} onChange={(e) => setText(e.target.value)} className="font-mono"/>
                        <Button onClick={copy} className="shrink-0">
                            {isCopied ? <Check size={16}/> : <Copy size={16}/>}
                            {isCopied ? 'Copied' : 'Copy'}
                        </Button>
                    </Row>
                </Field>
                <Field label="Paste here to check">
                    <Textarea rows={2} placeholder="Press Cmd+V or Ctrl+V" className="font-mono"/>
                </Field>
                <ReadoutGrid>
                    <Readout label="isCopied" value={String(isCopied)} live={isCopied} tone={isCopied ? 'signal' : 'default'}/>
                    <Readout label="error" value={error ? error.message : 'null'} tone={error ? 'danger' : 'default'}/>
                    <Readout label="copies" value={log.length}/>
                </ReadoutGrid>
                <Log entries={log} empty="Nothing copied yet."/>
            </div>
        </Stage>
    );
}
