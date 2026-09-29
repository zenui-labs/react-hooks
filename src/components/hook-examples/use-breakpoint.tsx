'use client'

import React from 'react';
import {useBreakpoint} from '@zenuilabs/react-hooks';
import {Note, Readout, ReadoutGrid, Stage, StageHeader} from '@/components/demo';
import {cn} from '@/lib/cn';

const BREAKPOINTS = {sm: 640, md: 768, lg: 1024, xl: 1280};
type Key = keyof typeof BREAKPOINTS;
const KEYS = Object.keys(BREAKPOINTS) as Key[];
const SCALE_MAX = 1600;

// Bands on the ruler: below sm (current is null), then one band per breakpoint.
const SEGMENTS = [null, ...KEYS].map((key, i) => ({
    key,
    start: key ? BREAKPOINTS[key] : 0,
    end: i < KEYS.length ? BREAKPOINTS[KEYS[i]] : SCALE_MAX,
}));

const pct = (px: number) => `${Math.min(100, (px / SCALE_MAX) * 100)}%`;

export default function UseBreakpointDemo() {
    // trackWidth moves the marker on every resize frame. Without it, width only updates at crossings.
    const {current, width, isAbove, isBelow} = useBreakpoint(BREAKPOINTS, {trackWidth: true});

    return (
        <Stage>
            <StageHeader
                title="Breakpoint ruler"
                hint="Resize the browser window. The marker tracks the viewport width; the highlighted band changes only when a media query flips."
                live
            />

            <div className="relative pt-7">
                {/* Current width marker */}
                <div
                    className="absolute top-0 z-10 -translate-x-1/2 transition-[left] duration-100"
                    style={{left: pct(width)}}
                >
                    <div className="rounded bg-signal px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-signal-ink">
                        {width}px
                    </div>
                    <div className="mx-auto h-16 w-0.5 bg-ink"/>
                </div>

                <div className="relative flex h-12 overflow-hidden rounded-xl border border-line-strong bg-paper">
                    {SEGMENTS.map(({key, start, end}) => (
                        <div
                            key={key ?? 'base'}
                            className={cn(
                                'flex items-center justify-center border-r border-line font-mono text-xs transition-colors last:border-r-0',
                                current === key ? 'bg-accent text-accent-ink' : 'text-ink-3'
                            )}
                            style={{width: pct(end - start)}}
                        >
                            {key ?? 'none'}
                        </div>
                    ))}
                </div>

                {/* Tick labels */}
                <div className="relative mt-1 h-5 font-mono text-[10px] text-ink-3">
                    {KEYS.map((key) => (
                        <span key={key} className="absolute -translate-x-1/2" style={{left: pct(BREAKPOINTS[key])}}>
                            {BREAKPOINTS[key]}
                        </span>
                    ))}
                </div>
            </div>

            <ReadoutGrid cols={4} className="mt-5">
                <Readout label="current" value={current ?? 'null'} tone="signal"/>
                <Readout label="width" value={`${width}px`}/>
                <Readout label="isAbove('md')" value={String(isAbove('md'))} tone={isAbove('md') ? 'ok' : 'default'}/>
                <Readout label="isBelow('lg')" value={String(isBelow('lg'))} tone={isBelow('lg') ? 'ok' : 'default'}/>
            </ReadoutGrid>
            <Note className="mt-3">
                Breakpoints are min-widths, mobile first: {'{'}sm: 640, md: 768, lg: 1024, xl: 1280{'}'}. The ruler
                spans 0 to {SCALE_MAX}px.
            </Note>
        </Stage>
    );
}
