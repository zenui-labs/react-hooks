'use client'

import {useEffect, useMemo, useRef, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {Search, X} from 'lucide-react';
import {useDebounce} from '@zenuilabs/react-hooks';
import type {HookCategory, HookLevel, HookSummary} from '@/types';
import {HookCard} from '@/components/site/hook-card';
import {LEVEL_LABEL} from '@/components/site/level';
import {categorySlug} from '@/lib/slug';
import {cn} from '@/lib/cn';

type Groups = { category: HookCategory; hooks: HookSummary[] }[];

const LEVELS: HookLevel[] = ['basic', 'intermediate', 'advanced'];

export function HookIndex({groups}: { groups: Groups }) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const inputRef = useRef<HTMLInputElement>(null);

    const all = useMemo(() => groups.flatMap((g) => g.hooks), [groups]);
    const categoryParam = params.get('category');
    const category = groups.find((g) => categorySlug(g.category) === categoryParam)?.category ?? null;
    const level = LEVELS.find((l) => l === params.get('level')) ?? null;
    const onlyNew = params.get('since') === '2.1.0';

    const [query, setQuery] = useState(params.get('q') ?? '');
    const debouncedQuery = useDebounce(query, 150);

    // Keep the URL shareable: every filter lives in the query string.
    const setParam = (key: string, value: string | null) => {
        const next = new URLSearchParams(params.toString());
        if (value === null) next.delete(key);
        else next.set(key, value);
        const qs = next.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, {scroll: false});
    };

    useEffect(() => {
        if ((params.get('q') ?? '') !== debouncedQuery) setParam('q', debouncedQuery || null);
    }, [debouncedQuery]);

    // "/" focuses search, Escape clears it.
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;
            const typing = target.closest('input, textarea, [contenteditable="true"]');
            if (event.key === '/' && !typing) {
                event.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const q = debouncedQuery.trim().toLowerCase();
    const matches = (hook: HookSummary) =>
        (!category || hook.category === category) &&
        (!level || hook.level === level) &&
        (!onlyNew || hook.since === '2.1.0') &&
        (!q || hook.name.toLowerCase().includes(q) || hook.description.toLowerCase().includes(q));

    const filteredGroups = groups
        .map((group) => ({...group, hooks: group.hooks.filter(matches)}))
        .filter((group) => group.hooks.length > 0);
    const total = filteredGroups.reduce((sum, group) => sum + group.hooks.length, 0);
    const hasFilters = Boolean(category || level || onlyNew || q);

    const clearAll = () => {
        setQuery('');
        router.replace(pathname, {scroll: false});
    };

    return (
        <div className="mx-auto max-w-[1320px] px-4 pb-28 pt-12 sm:px-6 lg:pt-16">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                <div>
                    <h1 className="font-display text-5xl font-semibold leading-none tracking-[-0.035em] text-ink sm:text-6xl [font-stretch:88%]">
                        All hooks
                    </h1>
                    <p className="mt-4 max-w-lg text-ink-2">
                        {all.length} hooks in {groups.length} groups. Every page has a live demo, a copyable
                        example and the full API.
                    </p>
                </div>

                <label className="relative block w-full lg:max-w-md">
                    <span className="sr-only">Search hooks</span>
                    <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3"/>
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={(event) => event.key === 'Escape' && setQuery('')}
                        placeholder="Filter by name or behavior"
                        className="h-12 w-full rounded-xl border border-line-strong bg-panel pl-11 pr-12 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-accent"
                    />
                    <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-line px-1.5 font-mono text-[11px] text-ink-3">/</kbd>
                </label>
            </div>

            <div className="sticky top-15 z-30 -mx-4 mt-10 border-y border-line bg-paper/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
                <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
                    <Chip active={!category} onClick={() => setParam('category', null)} count={all.length}>All</Chip>
                    {groups.map((group) => (
                        <Chip
                            key={group.category}
                            active={category === group.category}
                            onClick={() => setParam('category', category === group.category ? null : categorySlug(group.category))}
                            count={group.hooks.length}
                        >
                            {group.category}
                        </Chip>
                    ))}
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    <div className="flex items-center gap-1" role="group" aria-label="Level">
                        {LEVELS.map((l) => (
                            <button
                                key={l}
                                type="button"
                                aria-pressed={level === l}
                                onClick={() => setParam('level', level === l ? null : l)}
                                className={cn(
                                    'h-8 rounded-md px-2.5 font-mono text-xs transition-colors',
                                    level === l ? 'bg-accent-soft text-accent' : 'text-ink-3 hover:text-ink'
                                )}
                            >
                                {LEVEL_LABEL[l]}
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        aria-pressed={onlyNew}
                        onClick={() => setParam('since', onlyNew ? null : '2.1.0')}
                        className={cn(
                            'h-8 rounded-md px-2.5 font-mono text-xs transition-colors',
                            onlyNew ? 'bg-signal text-signal-ink' : 'text-ink-3 hover:text-ink'
                        )}
                    >
                        New in 2.1
                    </button>
                    <span className="ml-auto font-mono text-xs tabular-nums text-ink-3">
                        {total} of {all.length}
                    </span>
                    {hasFilters && (
                        <button type="button" onClick={clearAll} className="inline-flex items-center gap-1 font-mono text-xs text-ink-2 hover:text-ink">
                            <X size={13}/> Clear
                        </button>
                    )}
                </div>
            </div>

            {total === 0 ? (
                <div className="py-28 text-center">
                    <p className="font-display text-2xl text-ink">Nothing matches {q ? `"${debouncedQuery}"` : 'those filters'}.</p>
                    <p className="mt-2 text-ink-2">Try a browser API name, an event, or clear the filters.</p>
                    <button type="button" onClick={clearAll} className="mt-6 rounded-lg border border-line-strong px-4 py-2 text-sm text-ink hover:border-ink">
                        Clear filters
                    </button>
                </div>
            ) : (
                filteredGroups.map((group) => (
                    <section key={group.category} className="mt-14" aria-labelledby={`group-${categorySlug(group.category)}`}>
                        <h2 id={`group-${categorySlug(group.category)}`} className="flex items-baseline gap-3 border-b border-line pb-3">
                            <span className="font-display text-2xl font-medium tracking-tight text-ink">{group.category}</span>
                            <span className="font-mono text-xs tabular-nums text-ink-3">{group.hooks.length}</span>
                        </h2>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {group.hooks.map((hook) => <HookCard key={hook.slug} hook={hook} showCategory={false}/>)}
                        </div>
                    </section>
                ))
            )}
        </div>
    );
}

function Chip({active, onClick, count, children}: {
    active: boolean;
    onClick: () => void;
    count: number;
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={onClick}
            className={cn(
                'inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors',
                active ? 'border-ink bg-ink text-paper' : 'border-line text-ink-2 hover:border-line-strong hover:text-ink'
            )}
        >
            {children}
            <span className={cn('font-mono text-[11px] tabular-nums', active ? 'text-paper/60' : 'text-ink-3')}>{count}</span>
        </button>
    );
}
