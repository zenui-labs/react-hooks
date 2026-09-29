'use client'

import {useRef, useState} from 'react';
import {useEvent} from '@zenuilabs/react-hooks';
import {Button, Log, Pad, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

export default function UseEventDemo() {
    const padRef = useRef<HTMLDivElement>(null);
    const [showPad, setShowPad] = useState(true);
    const [width, setWidth] = useState(0);
    const [pointer, setPointer] = useState<{x: number; y: number} | null>(null);
    const [entries, setEntries] = useState<string[]>([]);

    const log = (line: string) => setEntries(prev => [line, ...prev].slice(0, 12));

    // Window: no target argument.
    useEvent('resize', () => setWidth(window.innerWidth));

    // Document: typed as a DocumentEventMap event.
    useEvent('visibilitychange', () => log(`visibilitychange: ${document.visibilityState}`), document);
    useEvent('keydown', (event) => log(`keydown: ${event.key}`), document);

    // Element through a ref. It re-binds when the element mounts again.
    useEvent('pointermove', (event) => {
        const rect = event.currentTarget instanceof HTMLElement ? event.currentTarget.getBoundingClientRect() : null;
        if (rect) setPointer({x: Math.round(event.clientX - rect.left), y: Math.round(event.clientY - rect.top)});
    }, padRef, {passive: true});
    useEvent('pointerleave', () => setPointer(null), padRef);

    return (
        <Stage>
            <StageHeader
                title="Listeners on window, document and an element"
                hint="Resize the window, press any key, switch tabs, or move the pointer over the pad."
            />
            <div className="space-y-4">
                <Row>
                    <Button variant="secondary" onClick={() => setShowPad(s => !s)}>{showPad ? 'Unmount pad' : 'Mount pad'}</Button>
                </Row>
                {showPad ? (
                    <Pad ref={padRef} active={pointer !== null} className="cursor-crosshair">
                        {pointer ? `${pointer.x}, ${pointer.y}` : 'Move the pointer here'}
                    </Pad>
                ) : (
                    <Pad>Pad unmounted. Mount it again and the listener follows.</Pad>
                )}
                <ReadoutGrid>
                    <Readout label="window resize" value={width ? `${width}px` : 'resize to update'}/>
                    <Readout label="pad pointermove" value={pointer ? `${pointer.x}, ${pointer.y}` : 'outside'} tone="accent"/>
                    <Readout label="document events" value={entries.length}/>
                </ReadoutGrid>
                <Log entries={entries} empty="Press a key or switch tabs."/>
            </div>
        </Stage>
    );
}
