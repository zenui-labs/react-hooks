import Link from 'next/link';
import type {HookSummary} from '@/types';
import {LevelBars} from '@/components/site/level';
import {isNewInRelease, RELEASE} from '@/lib/site';
import {cn} from '@/lib/cn';

/** Viewfinder corners that lock onto the card on hover, echoing the hero radar's crosshair. */
const CORNERS = [
    'left-2 top-2 border-l border-t -translate-x-1 -translate-y-1',
    'right-2 top-2 border-r border-t translate-x-1 -translate-y-1',
    'bottom-2 left-2 border-b border-l -translate-x-1 translate-y-1',
    'bottom-2 right-2 border-b border-r translate-x-1 translate-y-1',
];

export function HookCard({hook, showCategory = true, className}: { hook: HookSummary; showCategory?: boolean; className?: string }) {
    return (
        <Link
            href={`/hooks/${hook.slug}`}
            className={cn(
                'group relative flex min-h-44 flex-col overflow-hidden rounded-2xl border border-line bg-panel p-5 outline-none transition-colors duration-200 hover:border-line-strong focus-visible:border-line-strong',
                className
            )}
        >
            {/* Instrument grid that develops from the bottom-right corner. */}
            <span
                aria-hidden
                className="bg-dots pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [mask-image:radial-gradient(150%_130%_at_100%_100%,black_25%,transparent_80%)] group-hover:opacity-100 group-focus-visible:opacity-100"
            />
            {CORNERS.map((corner) => (
                <span
                    key={corner}
                    aria-hidden
                    className={cn(
                        'pointer-events-none absolute size-3 border-accent opacity-0 transition-[opacity,translate] duration-200 ease-out',
                        'group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-100',
                        corner
                    )}
                />
            ))}

            <span className="relative flex items-center justify-between gap-3">
                <span className="truncate font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                    {showCategory ? hook.category : isNewInRelease(hook.since) ? `New in ${RELEASE}` : `v${hook.since}`}
                </span>
                <LevelBars level={hook.level}/>
            </span>
            <span className="relative mt-5 font-mono text-[17px] font-medium text-ink">
                {hook.name}
                <span aria-hidden className="text-accent opacity-0 group-hover:animate-blink group-hover:opacity-100 group-focus-visible:opacity-100">_</span>
            </span>
            <span className="relative mt-2 line-clamp-2 text-sm leading-relaxed text-ink-2">{hook.description}</span>
        </Link>
    );
}
