import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {getHook, hookSequence, hooksData, summariesByCategory, toSummary} from '@/data';
import {SITE} from '@/lib/site';
import {categorySlug} from '@/lib/slug';
import {CopyButton} from '@/components/site/copy-button';
import {HookCard} from '@/components/site/hook-card';
import {LevelBars} from '@/components/site/level';
import {Sidebar} from '@/sections/hook-detail/sidebar';
import {HookTabs} from '@/sections/hook-detail/hook-tabs';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
    return Object.keys(hooksData).map((slug) => ({slug}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const hook = getHook((await params).slug);
    if (!hook) return {title: 'Hook not found'};

    const title = `${hook.name}: ${hook.category} hook`;
    return {
        title,
        description: hook.description,
        alternates: {canonical: `/hooks/${hook.slug}`},
        openGraph: {title, description: hook.description, url: `${SITE.url}/hooks/${hook.slug}`, type: 'article'},
        twitter: {card: 'summary_large_image', title, description: hook.description},
    };
}

export default async function Page({params}: Props) {
    const hook = getHook((await params).slug);
    if (!hook) notFound();

    const index = hookSequence.findIndex((h) => h.slug === hook.slug);
    const prev = hookSequence[index - 1];
    const next = hookSequence[index + 1];
    const related = hookSequence
        .filter((h) => h.category === hook.category && h.slug !== hook.slug)
        .slice(0, 3)
        .map(toSummary);
    const importLine = `import {${hook.name}} from '${SITE.packageName}';`;

    return (
        <div className="mx-auto grid max-w-[1320px] px-4 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
            <Sidebar groups={summariesByCategory} active={hook.slug}/>

            <article className="min-w-0 pb-24 pt-8 lg:pt-12">
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-ink-3">
                    <Link href="/hooks" className="hover:text-ink">Hooks</Link>
                    <span aria-hidden>/</span>
                    <Link href={`/hooks?category=${categorySlug(hook.category)}`} className="hover:text-ink">{hook.category}</Link>
                </nav>

                <h1 className="mt-5 break-words font-mono text-4xl font-medium tracking-[-0.03em] text-ink sm:text-5xl">
                    {hook.name}
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">{hook.description}</p>

                <dl className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <dt className="sr-only">Level</dt>
                        <dd><LevelBars level={hook.level} showLabel/></dd>
                    </div>
                    <div className="flex items-center gap-2">
                        <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">Since</dt>
                        <dd className="font-mono text-xs text-ink-2">v{hook.since}</dd>
                    </div>
                </dl>

                <div className="mt-8 flex items-center justify-between gap-3 rounded-xl border border-line bg-panel py-1.5 pl-4 pr-1.5">
                    <code className="min-w-0 truncate font-mono text-[13px] text-ink">
                        <span className="text-accent">import</span> {`{${hook.name}}`} <span className="text-accent">from</span>{' '}
                        <span className="text-ok">&apos;{SITE.packageName}&apos;</span>;
                    </code>
                    <CopyButton text={importLine}/>
                </div>

                <div className="mt-10">
                    <HookTabs hook={hook}/>
                </div>

                <nav aria-label="Previous and next hook" className="mt-20 grid gap-3 sm:grid-cols-2">
                    {prev ? <Pager hook={prev} direction="prev"/> : <span/>}
                    {next && <Pager hook={next} direction="next"/>}
                </nav>

                {related.length > 0 && (
                    <section className="mt-16">
                        <h2 className="mb-5 font-display text-2xl font-medium tracking-tight text-ink">More in {hook.category}</h2>
                        <div className="grid gap-3 md:grid-cols-3">
                            {related.map((h) => <HookCard key={h.slug} hook={h}/>)}
                        </div>
                    </section>
                )}
            </article>
        </div>
    );
}

function Pager({hook, direction}: { hook: { slug: string; name: string; category: string }; direction: 'prev' | 'next' }) {
    const isNext = direction === 'next';
    return (
        <Link
            href={`/hooks/${hook.slug}`}
            className={`group flex flex-col rounded-2xl border border-line p-5 transition-colors hover:border-line-strong ${isNext ? 'sm:items-end sm:text-right' : ''}`}
        >
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                {!isNext && <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5"/>}
                {isNext ? 'Next' : 'Previous'}
                {isNext && <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5"/>}
            </span>
            <span className="mt-2 font-mono text-lg text-ink transition-colors group-hover:text-accent">{hook.name}</span>
        </Link>
    );
}
