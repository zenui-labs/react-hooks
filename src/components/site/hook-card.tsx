'use client'

import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import type {HookSummary} from '@/types';
import {LevelBars} from '@/components/site/level';
import {cn} from '@/lib/cn';

export function HookCard({hook, showCategory = true, className}: { hook: HookSummary; showCategory?: boolean; className?: string }) {
    const onPointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
    };

    return (
        <Link
            href={`/hooks/${hook.slug}`}
            onPointerMove={onPointerMove}
            className={cn(
                'group relative flex min-h-44 flex-col overflow-hidden rounded-2xl border border-line bg-panel p-5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong',
                className
            )}
        >
            <span className="spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"/>
            <span className="relative flex items-center justify-between gap-3">
                <span className="truncate font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                    {showCategory ? hook.category : hook.since === '2.1.0' ? 'New in 2.1' : `v${hook.since}`}
                </span>
                <LevelBars level={hook.level}/>
            </span>
            <span className="relative mt-5 font-mono text-[17px] font-medium text-ink transition-colors group-hover:text-accent">
                {hook.name}
            </span>
            <span className="relative mt-2 line-clamp-2 text-sm leading-relaxed text-ink-2">{hook.description}</span>
            <ArrowUpRight
                size={16}
                className="absolute bottom-5 right-5 text-ink-3 opacity-0 transition-all duration-200 group-hover:text-accent group-hover:opacity-100"
            />
        </Link>
    );
}
