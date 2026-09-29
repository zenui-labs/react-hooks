'use client'

import {useRef, useState} from 'react';
import Link from 'next/link';
import {
    useEvent,
    useIdle,
    useIsClient,
    useMouse,
    useNetworkState,
    useScroll,
    useVisibilityChange,
    useWindowSize,
} from '@zenuilabs/react-hooks';
import {cn} from '@/lib/cn';

/**
 * The hero's instrument panel. Every row is a real hook from the package
 * reading this page, so the landing page doubles as a demo.
 */
export function LiveConsole() {
    const isClient = useIsClient();
    const panelRef = useRef<HTMLDivElement>(null);
    const mouse = useMouse();
    const scroll = useScroll();
    const size = useWindowSize();
    const visibility = useVisibilityChange();
    const network = useNetworkState();
    const {isIdle} = useIdle(4000);
    const [lastKey, setLastKey] = useState<string | null>(null);

    useEvent('keydown', (event) => {
        const key = event.key === ' ' ? 'Space' : event.key;
        setLastKey(key.length === 1 ? key.toUpperCase() : key);
    });

    // Spotlight follows the pointer across the panel through CSS variables.
    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
    };

    const docHeight = isClient ? document.documentElement.scrollHeight - size.height : 0;
    const scrollPct = docHeight > 0 ? Math.min(100, Math.round((scroll.y / docHeight) * 100)) : 0;

    const rows: { hook: string; value: string; live: boolean; extra?: React.ReactNode }[] = [
        {hook: 'useMouse', value: `x ${pad(mouse.x)}  y ${pad(mouse.y)}`, live: !isIdle},
        {
            hook: 'useScroll',
            value: `${pad(scroll.y)}px  ${scroll.direction ?? 'still'}`,
            live: scroll.y > 0,
            extra: <Progress value={scrollPct}/>,
        },
        {hook: 'useWindowSize', value: `${size.width} × ${size.height}`, live: true},
        {hook: 'useVisibilityChange', value: visibility.visible ? 'visible' : 'hidden', live: visibility.visible},
        {hook: 'useNetworkState', value: network.online ? 'online' : 'offline', live: network.online},
        {hook: 'useIdle', value: isIdle ? 'idle for 4s' : 'active', live: !isIdle},
        {hook: 'useEvent', value: lastKey ? `key ${lastKey}` : 'press any key', live: lastKey !== null},
    ];

    return (
        <div
            ref={panelRef}
            onPointerMove={onPointerMove}
            className="group relative overflow-hidden rounded-2xl border border-line-strong bg-panel shadow-[0_1px_0_0_var(--line),0_40px_80px_-40px_rgb(0_0_0/0.35)]"
        >
            <div className="spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"/>

            <div className="relative flex h-11 items-center justify-between border-b border-line px-4">
                <div className="flex items-center gap-2.5">
                    <span className="led" data-on={isClient && !isIdle}/>
                    <span className="font-mono text-xs text-ink-2">this-page.live</span>
                </div>
                <span className="font-mono text-[11px] text-ink-3">{rows.length} hooks attached</span>
            </div>

            <dl className="relative divide-y divide-line">
                {rows.map((row) => (
                    <div key={row.hook} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-2.5 sm:grid-cols-[180px_minmax(0,1fr)]">
                        <dt className="flex items-center gap-2.5">
                            <span className="led" data-on={isClient && row.live}/>
                            <Link href={`/hooks/${row.hook.toLowerCase()}`} className="font-mono text-[13px] text-ink-2 underline-offset-4 hover:text-accent hover:underline">
                                {row.hook}
                            </Link>
                        </dt>
                        <dd className="flex min-w-0 items-center justify-end gap-3 sm:justify-start">
                            <span
                                key={isClient ? row.value : 'ssr'}
                                className="animate-flash truncate rounded px-1.5 font-mono text-[13px] tabular-nums text-ink"
                            >
                                {isClient ? row.value : '...'}
                            </span>
                            {row.extra}
                        </dd>
                    </div>
                ))}
            </dl>

            <p className="relative border-t border-line px-4 py-3 text-xs leading-relaxed text-ink-3">
                Move, scroll, type or switch tabs. Each row is a hook from the package reading this page.
            </p>
        </div>
    );
}

function Progress({value}: { value: number }) {
    return (
        <span className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-panel-2 sm:block" aria-hidden>
            <span className={cn('block h-full rounded-full bg-accent transition-[width] duration-150')} style={{width: `${value}%`}}/>
        </span>
    );
}

function pad(n: number) {
    return String(Math.round(n)).padStart(4, ' ');
}
