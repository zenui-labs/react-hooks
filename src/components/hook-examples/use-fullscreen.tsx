'use client'

import {useEffect, useRef, useState} from 'react';
import {Maximize, Minimize} from 'lucide-react';
import {useFullscreen} from '@zenuilabs/react-hooks';
import {Button, Kbd, Log, Readout, ReadoutGrid, Stage, StageHeader, Unsupported} from '@/components/demo';

export default function UseFullscreenDemo() {
    const {ref, isFullscreen, isSupported, controls} = useFullscreen<HTMLDivElement>();
    const [log, setLog] = useState<string[]>([]);
    const first = useRef(true);

    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        setLog((entries) => [`${new Date().toLocaleTimeString()}  ${isFullscreen ? 'entered' : 'exited'} fullscreen`, ...entries].slice(0, 8));
    }, [isFullscreen]);

    return (
        <Stage>
            <StageHeader
                title="Present one element"
                hint="Only the panel below goes fullscreen, not the whole page. Leave with the button or the Escape key."
                live={isFullscreen}
            />
            <div className="space-y-4">
                <div
                    ref={ref}
                    className="flex min-h-56 flex-col items-center justify-center gap-4 rounded-xl border border-line bg-paper p-8 text-center"
                >
                    <p className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
                        {isFullscreen ? 'Now presenting' : 'Q3 roadmap'}
                    </p>
                    <p className="text-sm text-ink-2">
                        {isFullscreen ? <>Press <Kbd>Esc</Kbd> or use the button to exit.</> : 'Three launches, one theme: fewer clicks.'}
                    </p>
                    <Button onClick={controls.toggle} disabled={!isSupported}>
                        {isFullscreen ? <Minimize size={16}/> : <Maximize size={16}/>}
                        {isFullscreen ? 'Exit fullscreen' : 'Go fullscreen'}
                    </Button>
                </div>
                {!isSupported && <Unsupported api="Fullscreen API"/>}
                <ReadoutGrid cols={2}>
                    <Readout label="isFullscreen" value={String(isFullscreen)} live={isFullscreen}/>
                    <Readout label="isSupported" value={String(isSupported)}/>
                </ReadoutGrid>
                <Log entries={log} empty="No fullscreen changes yet."/>
            </div>
        </Stage>
    );
}
