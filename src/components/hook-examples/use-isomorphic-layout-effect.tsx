'use client'

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useIsomorphicLayoutEffect} from '@zenuilabs/react-hooks';
import {Button, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const TEXTS = ['Saved', 'Saved to drafts', 'Saved to the shared team folder', 'Synced'];

type Mode = 'effect' | 'layout';

// Blocks the main thread to stand in for a slow measurement, so the gap between
// the first paint and the effect is long enough to see.
function busyWait(ms: number) {
    const end = performance.now() + ms;
    while (performance.now() < end) {
        // spin
    }
}

function Badge({text, mode, onFirstFrame}: {
    text: string;
    mode: Mode;
    onFirstFrame: (mode: Mode, centered: boolean) => void;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    // Unknown until measured. The badge is remounted for every text, so it always starts at 0.
    const [offset, setOffset] = useState(0);
    const measureEffect = mode === 'layout' ? useIsomorphicLayoutEffect : useEffect;

    measureEffect(() => {
        busyWait(200);
        setOffset(-(ref.current?.offsetWidth ?? 0) / 2);
    }, []);

    // Inspect the DOM right before the first frame is painted.
    useIsomorphicLayoutEffect(() => {
        const frame = requestAnimationFrame(() => {
            onFirstFrame(mode, ref.current?.style.transform !== 'translateX(0px)');
        });
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <div className="relative h-24 overflow-hidden rounded-xl border border-line bg-paper/70">
            <div className="absolute inset-y-0 left-1/2 w-px bg-accent"/>
            <div
                ref={ref}
                className="absolute top-8 left-1/2 whitespace-nowrap rounded-md bg-ink px-2.5 py-1 text-sm text-paper"
                style={{transform: `translateX(${offset}px)`}}
            >
                {text}
            </div>
        </div>
    );
}

export default function UseIsomorphicLayoutEffectDemo() {
    const [run, setRun] = useState(0);
    const [uncentered, setUncentered] = useState<Record<Mode, number>>({effect: 0, layout: 0});

    const onFirstFrame = useCallback((mode: Mode, centered: boolean) => {
        if (!centered) setUncentered((prev) => ({...prev, [mode]: prev[mode] + 1}));
    }, []);

    const text = TEXTS[run % TEXTS.length];

    return (
        <Stage>
            <StageHeader
                title="Measure before paint"
                hint="Each badge centers itself on the line by measuring its own width. Press Change text: the left one is painted off center first, then jumps."
            />

            <Row>
                <Button onClick={() => setRun((r) => r + 1)}>Change text</Button>
            </Row>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div>
                    <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">useEffect</div>
                    <Badge key={`effect-${run}`} text={text} mode="effect" onFirstFrame={onFirstFrame}/>
                </div>
                <div>
                    <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                        useIsomorphicLayoutEffect
                    </div>
                    <Badge key={`layout-${run}`} text={text} mode="layout" onFirstFrame={onFirstFrame}/>
                </div>
            </div>

            <ReadoutGrid cols={3} className="mt-5">
                <Readout label="mounts" value={run + 1}/>
                <Readout label="useEffect: off-center frames" value={uncentered.effect} tone={uncentered.effect ? 'danger' : 'default'}/>
                <Readout label="layout: off-center frames" value={uncentered.layout} tone="ok"/>
            </ReadoutGrid>
            <Note className="mt-3">
                useEffect runs after the browser paints, so the first frame shows the badge before it was measured.
                The layout effect runs before paint. On the server there is no paint, so the hook uses useEffect there
                and React does not print the useLayoutEffect warning.
            </Note>
        </Stage>
    );
}
