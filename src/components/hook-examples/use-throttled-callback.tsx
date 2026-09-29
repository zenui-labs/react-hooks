'use client'

import {useEffect, useState, type PointerEvent} from 'react';
import {useThrottledCallback} from '@zenuilabs/react-hooks';
import {Button, Note, Pad, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const WINDOW = 4000;

function Strip({label, times, now, tone}: { label: string; times: number[]; now: number; tone: 'raw' | 'call' }) {
    return (
        <div className="flex items-center gap-3">
            <span className="w-16 shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">{label}</span>
            <div className="relative h-7 flex-1 overflow-hidden rounded-md border border-line bg-paper/80">
                {times.map((t, i) => {
                    const left = 100 - ((now - t) / WINDOW) * 100;
                    if (left < 0) return null;
                    return (
                        <span
                            key={`${t}-${i}`}
                            className={tone === 'raw'
                                ? 'absolute top-2 bottom-2 w-px bg-ink-3'
                                : 'absolute top-0.5 bottom-0.5 w-1 -translate-x-1/2 rounded-sm bg-accent'}
                            style={{left: `${left}%`}}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default function UseThrottledCallbackDemo() {
    const [interval, setIntervalMs] = useState(250);
    const [leading, setLeading] = useState(true);
    const [trailing, setTrailing] = useState(true);
    const [raw, setRaw] = useState<number[]>([]);
    const [calls, setCalls] = useState<number[]>([]);
    const [dot, setDot] = useState<{ x: number; y: number } | null>(null);
    const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
    const [now, setNow] = useState(() => Date.now());

    const track = useThrottledCallback((x: number, y: number) => {
        setDot({x, y});
        setTrail((list) => [...list, {x, y}].slice(-12));
        setCalls((list) => [...list.filter((t) => Date.now() - t < WINDOW), Date.now()]);
    }, interval, {leading, trailing});

    useEffect(() => {
        let frame = requestAnimationFrame(function tick() {
            setNow(Date.now());
            frame = requestAnimationFrame(tick);
        });
        return () => cancelAnimationFrame(frame);
    }, []);

    const onMove = (event: PointerEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setRaw((list) => [...list.filter((t) => Date.now() - t < WINDOW), Date.now()]);
        track(x, y);
    };

    const rawCount = raw.filter((t) => now - t < WINDOW).length;
    const callCount = calls.filter((t) => now - t < WINDOW).length;

    return (
        <Stage>
            <StageHeader
                title="Throttled pointer tracking"
                hint="Move the pointer around the pad. Raw pointer events fire constantly; the throttled handler runs at most once per interval."
            />

            <Pad onPointerMove={onMove} className="relative mb-5 min-h-48 cursor-crosshair touch-none overflow-hidden">
                {trail.map((p, i) => (
                    <span key={i} className="pointer-events-none absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-3"
                          style={{left: `${p.x}%`, top: `${p.y}%`, opacity: (i + 1) / trail.length}}/>
                ))}
                {dot && (
                    <span className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
                          style={{left: `${dot.x}%`, top: `${dot.y}%`}}/>
                )}
                {!dot && <span className="pointer-events-none">Move here</span>}
            </Pad>

            <div className="mb-5 space-y-2">
                <Strip label="events" times={raw} now={now} tone="raw"/>
                <Strip label="calls" times={calls} now={now} tone="call"/>
                <div className="flex justify-between pl-[76px] font-mono text-[10px] text-ink-3">
                    <span>-4s</span><span>now</span>
                </div>
            </div>

            <Row className="mb-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">interval</span>
                {[100, 250, 750].map((ms) => (
                    <Button key={ms} size="sm" variant={interval === ms ? 'primary' : 'secondary'} onClick={() => setIntervalMs(ms)}>
                        {ms} ms
                    </Button>
                ))}
                <Button size="sm" variant={leading ? 'primary' : 'secondary'} onClick={() => setLeading((v) => !v)}>
                    leading {leading ? 'on' : 'off'}
                </Button>
                <Button size="sm" variant={trailing ? 'primary' : 'secondary'} onClick={() => setTrailing((v) => !v)}>
                    trailing {trailing ? 'on' : 'off'}
                </Button>
                <Button size="sm" variant="ghost" onClick={track.flush}>flush()</Button>
                <Button size="sm" variant="ghost" onClick={track.cancel}>cancel()</Button>
            </Row>
            <Note>With trailing on, the dot always lands where the pointer stopped. Turn it off and it can stop short.</Note>

            <ReadoutGrid cols={3} className="mt-6">
                <Readout label="events (4s)" value={rawCount}/>
                <Readout label="calls (4s)" value={callCount} tone="accent"/>
                <Readout label="calls saved" value={rawCount ? `${Math.round((1 - callCount / rawCount) * 100)}%` : '0%'}/>
            </ReadoutGrid>
        </Stage>
    );
}
