'use client'

import {useEffect, useRef, useState} from 'react';
import {Hash} from 'lucide-react';
import {useHash} from '@zenuilabs/react-hooks';
import {cn} from '@/lib/cn';
import {Button, Field, Input, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const SLIDES = ['demo-intro', 'demo-setup', 'demo-done'];

export default function UseHashDemo() {
    const {hash, setHash} = useHash();
    const [custom, setCustom] = useState('demo-custom');
    const [log, setLog] = useState<string[]>([]);
    const first = useRef(true);

    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        setLog((entries) => [`hashchange  ${hash || '(empty)'}`, ...entries].slice(0, 8));
    }, [hash]);

    const current = SLIDES.indexOf(hash.slice(1));

    return (
        <Stage>
            <StageHeader
                title="Slides in the URL"
                hint="Each step writes to the hash. Watch the address bar, then use the browser back button to step backward."
            />
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                    {SLIDES.map((slide, i) => (
                        <button
                            key={slide}
                            type="button"
                            onClick={() => setHash(slide)}
                            className={cn(
                                'rounded-xl border px-3 py-6 text-center font-mono text-sm transition-colors',
                                i === current ? 'border-accent bg-accent-soft text-ink' : 'border-line bg-paper text-ink-2 hover:border-line-strong'
                            )}
                        >
                            #{slide}
                        </button>
                    ))}
                </div>
                <Field label="Any hash">
                    <Row className="flex-nowrap">
                        <Input value={custom} onChange={(e) => setCustom(e.target.value)} className="font-mono"/>
                        <Button onClick={() => setHash(custom)} className="shrink-0"><Hash size={16}/> Set</Button>
                        <Button variant="ghost" onClick={() => setHash('')} className="shrink-0">Clear</Button>
                    </Row>
                </Field>
                <ReadoutGrid cols={2}>
                    <Readout label="hash" value={hash || '""'} tone="signal"/>
                    <Readout label="step" value={current === -1 ? 'none' : `${current + 1} of ${SLIDES.length}`}/>
                </ReadoutGrid>
                <Log entries={log} empty="Click a slide to change the hash."/>
                <Note>The &quot;#&quot; is optional when you call setHash.</Note>
            </div>
        </Stage>
    );
}
