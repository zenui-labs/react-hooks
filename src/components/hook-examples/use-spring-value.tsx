'use client'

import React, {useEffect, useRef, useState} from 'react';
import {useSpringValue} from '@zenuilabs/react-hooks';
import {Button, Field, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const PRESETS = [
    {label: 'Default', stiffness: 170, damping: 26, mass: 1},
    {label: 'Wobbly', stiffness: 180, damping: 8, mass: 1},
    {label: 'Stiff', stiffness: 400, damping: 40, mass: 1},
    {label: 'Heavy', stiffness: 120, damping: 14, mass: 4},
];

const TRACE = 160;

function Slider({label, value, min, max, step, onChange}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
}) {
    return (
        <Field label={`${label} ${value}`}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
                className="w-full accent-current text-accent"
            />
        </Field>
    );
}

export default function UseSpringValueDemo() {
    const [target, setTarget] = useState(20);
    const [config, setConfig] = useState(PRESETS[1]);
    const [dragging, setDragging] = useState(false);
    const track = useRef<HTMLDivElement>(null);
    const trace = useRef<number[]>([]);

    const {value, velocity, isAnimating, isReducedMotion} = useSpringValue(target, {
        stiffness: config.stiffness,
        damping: config.damping,
        mass: config.mass,
        precision: 0.01,
    });

    useEffect(() => {
        trace.current.push(value);
        if (trace.current.length > TRACE) trace.current.shift();
    }, [value]);

    const moveTo = (clientX: number) => {
        const rect = track.current?.getBoundingClientRect();
        if (!rect) return;
        setTarget(Math.round(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))));
    };

    const points = trace.current.map((v, i) => `${(i / (TRACE - 1)) * 100},${100 - v}`).join(' ');

    return (
        <Stage>
            <StageHeader
                title="Spring playground"
                hint="Click or drag anywhere on the track to move the target. The ball follows with real spring physics, so a fast drag builds velocity and low damping overshoots."
            />

            <div
                ref={track}
                role="slider"
                aria-label="Spring target"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={target}
                tabIndex={0}
                onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    setDragging(true);
                    moveTo(event.clientX);
                }}
                onPointerMove={(event) => dragging && moveTo(event.clientX)}
                onPointerUp={() => setDragging(false)}
                onPointerCancel={() => setDragging(false)}
                onKeyDown={(event) => {
                    if (event.key === 'ArrowLeft') setTarget((t) => Math.max(0, t - 10));
                    if (event.key === 'ArrowRight') setTarget((t) => Math.min(100, t + 10));
                }}
                className="relative mx-4 h-24 cursor-pointer touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
                <div className="absolute inset-x-0 top-1/2 h-px bg-line-strong"/>
                <div
                    className="absolute top-1/2 h-10 w-px -translate-y-1/2 bg-ink-3"
                    style={{left: `${target}%`}}
                    aria-hidden
                />
                <div
                    className="absolute top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-accent"
                    style={{left: `${value}%`}}
                    aria-hidden
                />
            </div>

            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-3 h-16 w-full text-accent" aria-hidden>
                <line x1="0" x2="100" y1={100 - target} y2={100 - target} className="text-ink-3" stroke="currentColor" strokeDasharray="2 2" vectorEffect="non-scaling-stroke"/>
                {trace.current.length > 1 && (
                    <polyline points={points} fill="none" stroke="currentColor" strokeWidth={1.5} vectorEffect="non-scaling-stroke"/>
                )}
            </svg>

            <Row className="mt-4">
                {PRESETS.map((p) => (
                    <Button key={p.label} size="sm" variant={config.label === p.label ? 'primary' : 'secondary'} onClick={() => setConfig(p)}>
                        {p.label}
                    </Button>
                ))}
                <Button size="sm" variant="ghost" onClick={() => setTarget((t) => (t > 50 ? 5 : 95))}>Flip target</Button>
            </Row>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Slider label="stiffness" value={config.stiffness} min={20} max={500} step={10}
                        onChange={(stiffness) => setConfig((c) => ({...c, label: 'Custom', stiffness}))}/>
                <Slider label="damping" value={config.damping} min={1} max={60} step={1}
                        onChange={(damping) => setConfig((c) => ({...c, label: 'Custom', damping}))}/>
                <Slider label="mass" value={config.mass} min={0.2} max={6} step={0.2}
                        onChange={(mass) => setConfig((c) => ({...c, label: 'Custom', mass}))}/>
            </div>

            <ReadoutGrid cols={4} className="mt-4">
                <Readout label="target" value={target}/>
                <Readout label="value" value={value.toFixed(2)} tone="accent"/>
                <Readout label="velocity" value={velocity.toFixed(1)}/>
                <Readout label="isAnimating" value={String(isAnimating)} live={isAnimating}/>
            </ReadoutGrid>

            <Note className="mt-4">
                {isReducedMotion
                    ? 'Your system asks for reduced motion, so the value jumps straight to the target.'
                    : 'With prefers-reduced-motion turned on, the hook skips the animation and jumps to the target.'}
            </Note>
        </Stage>
    );
}
