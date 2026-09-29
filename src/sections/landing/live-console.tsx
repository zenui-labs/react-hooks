'use client'

import {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {ArrowDown, ArrowUp} from 'lucide-react';
import {
    useAnimationFrame,
    useEvent,
    useIdle,
    useInterval,
    useIsClient,
    useMouse,
    useNetworkState,
    useReducedMotion,
    useScroll,
    useVisibilityChange,
    useWindowSize,
} from '@zenuilabs/react-hooks';
import {cn} from '@/lib/cn';

const TRAIL_MS = 900;
const RIPPLE_MS = 750;

type Point = { x: number; y: number; t: number };
type Palette = { accent: string; signal: string; line: string };

/**
 * The hero's instrument panel. A radar maps the pointer across the whole window and the
 * readouts below it are real hooks from the package reading this page, so the landing
 * page doubles as a demo.
 */
export function LiveConsole() {
    const isClient = useIsClient();
    const mouse = useMouse();
    const scroll = useScroll();
    const size = useWindowSize();
    const visibility = useVisibilityChange();
    const network = useNetworkState();
    const reducedMotion = useReducedMotion();
    const {isIdle} = useIdle(4000);
    const [key, setKey] = useState<{ label: string; stamp: number } | null>(null);
    const [uptime, setUptime] = useState(0);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const trail = useRef<Point[]>([]);
    const ripples = useRef<Point[]>([]);
    const palette = useRef<Palette | null>(null);
    const [moved, setMoved] = useState(false);

    useInterval(() => setUptime((s) => s + 1), visibility.visible ? 1000 : null);

    useEvent('keydown', (event) => {
        const raw = (event as KeyboardEvent).key;
        const label = raw === ' ' ? 'Space' : raw.length === 1 ? raw.toUpperCase() : raw;
        setKey({label, stamp: Date.now()});
    });

    useEvent('pointerdown', (event) => {
        const {clientX, clientY} = event as PointerEvent;
        if (!reducedMotion) ripples.current.push({x: clientX / window.innerWidth, y: clientY / window.innerHeight, t: performance.now()});
    });

    // Record the pointer as a fraction of the window so the radar is resolution independent.
    useEffect(() => {
        if (!size.width || !size.height || (mouse.x === 0 && mouse.y === 0)) return;
        trail.current.push({x: mouse.x / size.width, y: mouse.y / size.height, t: performance.now()});
        if (trail.current.length > 80) trail.current.shift();
        setMoved(true);
    }, [mouse.x, mouse.y, size.width, size.height]);

    useAnimationFrame(({time, frame}) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (!palette.current || frame % 30 === 0) palette.current = readPalette(canvas);
        draw(canvas, palette.current, time, trail.current, ripples.current, reducedMotion);
    }, {enabled: isClient && visibility.visible && !isIdle});

    const docHeight = isClient ? document.documentElement.scrollHeight : 0;
    const thumb = docHeight > 0 ? Math.min(100, (size.height / docHeight) * 100) : 100;
    const maxScroll = docHeight - size.height;
    const scrollPct = maxScroll > 0 ? Math.min(1, scroll.y / maxScroll) : 0;

    return (
        <div className="relative isolate">
            {/* Soft brand glow behind the panel. */}
            <div aria-hidden className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_22%,transparent),transparent)] blur-2xl"/>

            <div className="beam relative overflow-hidden rounded-2xl border border-line-strong bg-panel shadow-[0_1px_0_0_var(--line),0_40px_80px_-40px_rgb(0_0_0/0.45)]">
                <div className="relative flex h-11 items-center justify-between border-b border-line px-4">
                    <div className="flex items-center gap-3">
                        <span className="flex gap-1.5" aria-hidden>
                            <span className="size-2.5 rounded-full bg-line-strong"/>
                            <span className="size-2.5 rounded-full bg-line-strong"/>
                            <span className="size-2.5 rounded-full bg-line-strong"/>
                        </span>
                        <span className="font-mono text-xs text-ink-2">this-page.live</span>
                    </div>
                    <span className="flex items-center gap-2 font-mono text-[11px] tabular-nums text-ink-3">
                        <span className="led" data-on={isClient && !isIdle} data-tone={isClient && !network.online ? 'danger' : undefined}/>
                        {isIdle ? 'paused' : 'rec'} {formatUptime(uptime)}
                    </span>
                </div>

                {/* Radar: the whole window, scaled into the panel. */}
                <div className="relative h-56 border-b border-line bg-dots sm:h-64">
                    <canvas ref={canvasRef} className="absolute inset-0 size-full" aria-hidden/>

                    <div className="absolute left-4 top-3 flex items-center gap-2">
                        <span className="led" data-on={isClient && moved && !isIdle}/>
                        <HookLink name="useMouse"/>
                    </div>
                    <span className="absolute right-7 top-3 rounded bg-panel/80 px-1.5 font-mono text-xs tabular-nums text-ink backdrop-blur">
                        {isClient ? `x ${pad(mouse.x)}  y ${pad(mouse.y)}` : 'x ----  y ----'}
                    </span>

                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                        <HookLink name="useWindowSize"/>
                        <span className="rounded bg-panel/80 px-1.5 font-mono text-xs tabular-nums text-ink backdrop-blur">
                            {isClient ? `${size.width} × ${size.height}` : '---- × ----'}
                        </span>
                    </div>
                    <div className="absolute bottom-3 right-7 flex items-center gap-2">
                        <HookLink name="useScroll"/>
                        <span className="inline-flex items-center gap-1 rounded bg-panel/80 px-1.5 font-mono text-xs tabular-nums text-ink backdrop-blur">
                            {Math.round(scrollPct * 100)}%
                            {scroll.direction === 'down' && <ArrowDown size={12} className="text-accent"/>}
                            {scroll.direction === 'up' && <ArrowUp size={12} className="text-accent"/>}
                        </span>
                    </div>

                    {/* Viewport position within the document. */}
                    <div aria-hidden className="absolute bottom-3 right-3 top-3 w-1 rounded-full bg-line">
                        <div
                            className="absolute inset-x-0 rounded-full bg-accent transition-[top] duration-150 ease-out"
                            style={{height: `${thumb}%`, top: `${scrollPct * (100 - thumb)}%`}}
                        />
                    </div>

                    <p
                        className={cn(
                            'pointer-events-none absolute inset-x-0 top-1/2 mt-6 text-center font-mono text-[11px] text-ink-3 transition-opacity duration-500',
                            moved ? 'opacity-0' : 'opacity-100'
                        )}
                    >
                        move your pointer anywhere on the page
                    </p>
                </div>

                <dl className="grid grid-cols-2 [&>div:nth-child(odd)]:border-r [&>div:nth-child(-n+2)]:border-b [&>div]:border-line">
                    <Readout hook="useVisibilityChange" live={visibility.visible} ready={isClient}>
                        {visibility.visible ? 'visible' : 'hidden'}
                    </Readout>
                    <Readout hook="useNetworkState" live={network.online} ready={isClient} danger={!network.online}>
                        {network.online ? 'online' : 'offline'}
                    </Readout>
                    <Readout hook="useIdle" live={!isIdle} ready={isClient}>
                        {isIdle ? 'idle 4s' : 'active'}
                    </Readout>
                    <Readout hook="useEvent" live={key !== null} ready={isClient}>
                        {key ? (
                            <kbd key={key.stamp} className="animate-keypress inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-line-strong border-b-2 bg-panel-2 px-1.5 font-mono text-xs text-ink">
                                {key.label}
                            </kbd>
                        ) : (
                            <span className="text-ink-3">press a key</span>
                        )}
                    </Readout>
                </dl>
            </div>
        </div>
    );
}

function Readout({hook, live, ready, danger, children}: {
    hook: string;
    live: boolean;
    ready: boolean;
    danger?: boolean;
    children: React.ReactNode
}) {
    return (
        <div className="flex min-w-0 flex-col gap-1.5 px-4 py-3">
            <dt className="flex items-center gap-2">
                <span className="led" data-on={ready && live} data-tone={danger ? 'danger' : undefined}/>
                <HookLink name={hook}/>
            </dt>
            <dd className="flex h-6 items-center truncate font-mono text-sm tabular-nums text-ink">{ready ? children : '...'}</dd>
        </div>
    );
}

function HookLink({name}: { name: string }) {
    return (
        <Link href={`/hooks/${name.toLowerCase()}`} className="font-mono text-[12px] text-ink-2 underline-offset-4 hover:text-accent hover:underline">
            {name}
        </Link>
    );
}

function draw(canvas: HTMLCanvasElement, colors: Palette, time: number, trail: Point[], ripples: Point[], reducedMotion: boolean) {
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const now = performance.now();
    while (trail.length > 1 && now - trail[0].t > TRAIL_MS) trail.shift();
    while (ripples.length && now - ripples[0].t > RIPPLE_MS) ripples.shift();

    // Keep the radar clear of the labels along the top and bottom edges.
    const pad = {x: 18, y: 38};
    const map = (p: { x: number; y: number }) => ({
        x: pad.x + p.x * (width - pad.x * 2 - 10),
        y: pad.y + p.y * (height - pad.y * 2),
    });

    const last = trail[trail.length - 1];
    const idleHead = !last;
    const head = last ? map(last) : {
        x: width / 2,
        y: height / 2 - 10 + (reducedMotion ? 0 : Math.sin(time / 600) * 4),
    };

    // Crosshair.
    ctx.save();
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(0, Math.round(head.y) + 0.5);
    ctx.lineTo(width, Math.round(head.y) + 0.5);
    ctx.moveTo(Math.round(head.x) + 0.5, 0);
    ctx.lineTo(Math.round(head.x) + 0.5, height);
    ctx.stroke();
    ctx.restore();

    // Trail, fading with age.
    if (!reducedMotion && trail.length > 1) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 1; i < trail.length; i++) {
            const life = 1 - (now - trail[i].t) / TRAIL_MS;
            if (life <= 0) continue;
            const a = map(trail[i - 1]);
            const b = map(trail[i]);
            ctx.globalAlpha = life * 0.9;
            ctx.strokeStyle = colors.accent;
            ctx.lineWidth = 1 + life * 2.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    // Click ripples.
    for (const ripple of ripples) {
        const progress = (now - ripple.t) / RIPPLE_MS;
        const at = map(ripple);
        ctx.globalAlpha = 1 - progress;
        ctx.strokeStyle = colors.signal;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(at.x, at.y, 6 + easeOut(progress) * 34, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Pointer head: halo, ring and core.
    const pulse = reducedMotion ? 0 : (Math.sin(time / 280) + 1) / 2;
    ctx.globalAlpha = idleHead ? 0.12 : 0.18 + pulse * 0.12;
    ctx.fillStyle = colors.accent;
    ctx.beginPath();
    ctx.arc(head.x, head.y, 14 + pulse * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(head.x, head.y, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = idleHead ? colors.accent : colors.signal;
    ctx.beginPath();
    ctx.arc(head.x, head.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
}

function readPalette(el: HTMLElement): Palette {
    const style = getComputedStyle(el);
    return {
        accent: style.getPropertyValue('--accent').trim() || '#9179ff',
        signal: style.getPropertyValue('--signal').trim() || '#d4ff3a',
        line: style.getPropertyValue('--line-strong').trim() || '#33333b',
    };
}

function easeOut(t: number) {
    return 1 - Math.pow(1 - t, 3);
}

function formatUptime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function pad(n: number) {
    return String(Math.round(n)).padStart(4, '0');
}
