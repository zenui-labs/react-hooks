import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {hookList, toSummary} from '@/data';
import {HookCard} from '@/components/site/hook-card';
import {LevelBars} from '@/components/site/level';

export function Popular() {
    const popular = hookList.filter((hook) => hook.popular).map(toSummary);

    return (
        <section className="mx-auto max-w-[1320px] px-4 py-24 sm:px-6">
            <SectionTitle title="Where most people start." href="/hooks" link="All hooks"/>
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {popular.map((hook) => <HookCard key={hook.slug} hook={hook}/>)}
            </div>
        </section>
    );
}

/** The 2.1 additions, hardest first. */
export function NewInRelease() {
    const order = {advanced: 0, intermediate: 1, basic: 2};
    const added = hookList
        .filter((hook) => hook.since === '2.1.0')
        .sort((a, b) => order[a.level] - order[b.level] || a.name.localeCompare(b.name));

    if (added.length === 0) return null;

    return (
        <section className="mx-auto max-w-[1320px] px-4 pb-28 sm:px-6">
            <SectionTitle title={`New in 2.1: ${added.length} hooks for harder problems.`} href="/hooks?since=2.1.0" link="See what changed"/>
            <ul className="mt-12 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                {added.map((hook) => (
                    <li key={hook.slug} className="border-b border-line">
                        <Link href={`/hooks/${hook.slug}`} className="group flex items-center justify-between gap-4 py-3.5">
                            <span className="min-w-0">
                                <span className="block font-mono text-sm text-ink transition-colors group-hover:text-accent">{hook.name}</span>
                                <span className="block truncate text-xs text-ink-3">{hook.category}</span>
                            </span>
                            <LevelBars level={hook.level}/>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function SectionTitle({title, href, link}: { title: string; href: string; link: string }) {
    return (
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <h2 className="max-w-2xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-5xl [font-stretch:90%]">
                {title}
            </h2>
            <Link href={href} className="group inline-flex shrink-0 items-center gap-2 text-sm text-ink-2 hover:text-ink">
                {link}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5"/>
            </Link>
        </div>
    );
}
