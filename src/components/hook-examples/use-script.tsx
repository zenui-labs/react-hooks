'use client'

import React, {useEffect, useState} from 'react';
import {Sparkles} from 'lucide-react';
import {type ScriptStatus, useScript} from '@zenuilabs/react-hooks';
import {Button, Led, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const SRC = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';

type Confetti = (options?: { particleCount?: number; spread?: number; origin?: { x?: number; y?: number } }) => void;

const TONE: Record<ScriptStatus, 'default' | 'accent' | 'ok' | 'danger'> = {
    idle: 'default',
    loading: 'accent',
    ready: 'ok',
    error: 'danger',
};

/** A second, independent consumer of the same src. */
function Consumer({src, label}: { src: string | null; label: string }) {
    const status = useScript(src);
    return <Readout label={label} value={status} tone={TONE[status]} live={status === 'loading'}/>;
}

export default function UseScriptDemo() {
    const [src, setSrc] = useState<string | null>(null);
    const [second, setSecond] = useState(false);
    const status = useScript(src);
    const [tags, setTags] = useState(0);

    useEffect(() => {
        setTags(document.querySelectorAll(`script[src="${SRC}"]`).length);
    }, [status, second]);

    const fire = () => {
        const confetti = (window as Window & { confetti?: Confetti }).confetti;
        confetti?.({particleCount: 140, spread: 80, origin: {y: 0.7}});
    };

    return (
        <Stage>
            <StageHeader
                title="Load a script on demand"
                hint="Nothing is downloaded until you press Load. Then the status moves to ready and the button fires confetti from the CDN script."
            />

            <Row>
                <Button onClick={() => setSrc(SRC)} disabled={src !== null}>Load confetti</Button>
                <Button variant="secondary" onClick={fire} disabled={status !== 'ready'}>
                    <Sparkles className="size-4"/>Fire
                </Button>
                <Button variant="ghost" onClick={() => setSecond((s) => !s)}>
                    {second ? 'Remove second consumer' : 'Add second consumer'}
                </Button>
                <Led on={status === 'ready'} label={status}/>
            </Row>

            <ReadoutGrid cols={3} className="mt-5">
                <Readout label="status" value={status} tone={TONE[status]} live={status === 'loading'}/>
                {second ? (
                    <Consumer src={SRC} label="second consumer"/>
                ) : (
                    <Readout label="second consumer" value="not mounted" className="opacity-60"/>
                )}
                <Readout label="script tags in DOM" value={tags}/>
            </ReadoutGrid>
            <Note className="mt-3 break-all">
                src: {SRC}. The second consumer shares the cached status, and the tag count stays at 1 however
                many components ask for the same src.
            </Note>
        </Stage>
    );
}
