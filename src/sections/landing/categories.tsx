import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {hooksByCategory} from '@/data';
import {categorySlug} from '@/lib/slug';

export function Categories() {
    return (
        <section className="border-y border-line bg-panel/40">
            <div className="mx-auto max-w-[1320px] px-4 py-24 sm:px-6">
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                    <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-5xl [font-stretch:90%]">
                        Start from the problem.
                    </h2>
                    <p className="max-w-sm text-ink-2">
                        Hooks are grouped by what you are trying to do, not by which browser API they wrap.
                    </p>
                </div>

                <ol className="mt-14 border-t border-line">
                    {hooksByCategory.map(({category, hooks}, index) => (
                        <li key={category}>
                            <Link
                                href={`/hooks?category=${categorySlug(category)}`}
                                className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 border-b border-line py-5 transition-colors hover:bg-panel sm:grid-cols-[3.5rem_minmax(0,16rem)_minmax(0,1fr)_auto] sm:px-3"
                            >
                                <span className="font-mono text-xs text-ink-3 tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                                <span className="font-display text-2xl font-medium tracking-tight text-ink transition-colors group-hover:text-accent sm:text-[1.7rem]">
                                    {category}
                                </span>
                                <span className="hidden min-w-0 truncate font-mono text-[13px] text-ink-3 sm:block">
                                    {hooks.slice(0, 4).map((hook) => hook.name).join('  ')}
                                </span>
                                <span className="flex items-center gap-3">
                                    <span className="font-mono text-sm tabular-nums text-ink-2">{hooks.length}</span>
                                    <ArrowRight size={18} className="-translate-x-1 text-ink-3 opacity-0 transition-all group-hover:translate-x-0 group-hover:text-accent group-hover:opacity-100"/>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
