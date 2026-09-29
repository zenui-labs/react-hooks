'use client'

import {useEffect, useRef} from 'react';
import Link from 'next/link';
import type {HookCategory, HookSummary} from '@/types';
import {cn} from '@/lib/cn';

/** Docs sidebar. Keeps the active hook scrolled into view. */
export function Sidebar({groups, active}: {
    groups: { category: HookCategory; hooks: HookSummary[] }[];
    active: string
}) {
    const navRef = useRef<HTMLElement>(null);
    const activeRef = useRef<HTMLAnchorElement>(null);

    // Scroll only the sidebar. scrollIntoView would also move the window.
    useEffect(() => {
        const nav = navRef.current;
        const link = activeRef.current;
        if (!nav || !link) return;
        const top = link.getBoundingClientRect().top - nav.getBoundingClientRect().top + nav.scrollTop;
        if (top < nav.scrollTop || top > nav.scrollTop + nav.clientHeight - 40) {
            nav.scrollTop = top - nav.clientHeight / 2;
        }
    }, [active]);

    return (
        <nav ref={navRef} aria-label="Hooks" className="sticky top-15 hidden h-[calc(100dvh-3.75rem)] overflow-y-auto border-r border-line py-8 pr-4 [scrollbar-width:thin] lg:block">
            {groups.map(({category, hooks}) => (
                <div key={category} className="mb-7">
                    <h2 className="mb-2 px-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">{category}</h2>
                    <ul>
                        {hooks.map((hook) => {
                            const isActive = hook.slug === active;
                            return (
                                <li key={hook.slug}>
                                    <Link
                                        ref={isActive ? activeRef : undefined}
                                        href={`/hooks/${hook.slug}`}
                                        aria-current={isActive ? 'page' : undefined}
                                        className={cn(
                                            'relative flex items-center rounded-md px-3 py-1.5 font-mono text-[13px] transition-colors',
                                            isActive
                                                ? 'bg-panel-2 text-ink before:absolute before:-left-px before:top-1.5 before:bottom-1.5 before:w-0.5 before:rounded-full before:bg-accent'
                                                : 'text-ink-2 hover:text-ink'
                                        )}
                                    >
                                        {hook.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
}
