'use client'

import React, {useRef, useState} from 'react';
import {useAnimationFrame} from '@zenuilabs/react-hooks';
import {Pause, Play} from 'lucide-react';
import {Button, Field, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const TRAIL = 180;

export default function UseAnimationFrameDemo() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const phase = useRef(0);
    const trail = useRef<Array<[number, number]>>([]);
    const color = useRef('currentColor');
    const [speed, setSpeed] = useState(1);
    const [stats, setStats] = useState({fps: 0, frame: 0, delta: 0});
    const sample = useRef({frames: 0, time: 0});

    const {start, stop, isRunning} = useAnimationFrame(({delta, frame}) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        // Match the backing store to the element size so lines stay crisp.
        const dpr = window.devicePixelRatio || 1;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (canvas.width !== Math.round(width * dpr)) {
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
        }
        if (frame % 30 === 0) color.current = getComputedStyle(canvas).color;

        // Advance by elapsed time, not by frame count, so speed is the same at 60Hz and 120Hz.
        phase.current += (delta / 1000) * speed;
        const t = phase.current;
        const x = width / 2 + Math.sin(t * 3) * (width / 2 - 16);
        const y = height / 2 + Math.sin(t * 4 + Math.PI / 4) * (height / 2 - 16);
        trail.current.push([x, y]);
        if (trail.current.length > TRAIL) trail.current.shift();

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = color.current;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        const points = trail.current;
        for (let i = 1; i < points.length; i++) {
            ctx.globalAlpha = i / points.length;
            ctx.beginPath();
            ctx.moveTo(points[i - 1][0], points[i - 1][1]);
            ctx.lineTo(points[i][0], points[i][1]);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = color.current;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Publish readouts four times a second instead of re-rendering every frame.
        sample.current.frames += 1;
        sample.current.time += delta;
        if (sample.current.time >= 250) {
            const fps = Math.round((sample.current.frames * 1000) / sample.current.time);
            setStats({fps, frame, delta: Math.round(delta * 10) / 10});
            sample.current = {frames: 0, time: 0};
        }
    });

    return (
        <Stage>
            <StageHeader
                title="Frame loop"
                hint="A pen traces a Lissajous curve on a canvas. Movement is scaled by delta, so the speed stays the same on any refresh rate. Stop the loop and the frame counter freezes."
            />

            <canvas ref={canvasRef} className="h-56 w-full rounded-xl border border-line bg-paper/80 text-accent" aria-label="Animated curve"/>

            <Row className="mt-4 items-end gap-4">
                <Button onClick={isRunning ? stop : start}>
                    {isRunning ? <><Pause size={16}/> Stop</> : <><Play size={16}/> Start</>}
                </Button>
                <div className="min-w-48 flex-1">
                    <Field label={`speed ${speed.toFixed(1)}x`}>
                        <input
                            type="range"
                            min={0.2}
                            max={4}
                            step={0.1}
                            value={speed}
                            onChange={(event) => setSpeed(Number(event.target.value))}
                            className="w-full accent-current text-accent"
                        />
                    </Field>
                </div>
            </Row>

            <ReadoutGrid cols={4} className="mt-4">
                <Readout label="isRunning" value={String(isRunning)} live={isRunning}/>
                <Readout label="fps" value={isRunning ? stats.fps : 0} tone="accent"/>
                <Readout label="frame" value={stats.frame}/>
                <Readout label="delta" value={`${stats.delta}ms`}/>
            </ReadoutGrid>

            <Note className="mt-4">
                The callback reads the latest speed on every frame without restarting the loop, and the loop is
                cancelled when the component unmounts.
            </Note>
        </Stage>
    );
}
