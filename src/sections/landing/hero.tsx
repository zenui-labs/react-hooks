import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {hookList} from '@/data';
import {InstallCommand} from '@/components/site/install-command';
import {GithubIcon} from '@/components/site/icons';
import {SITE} from '@/lib/site';
import {LiveConsole} from '@/sections/landing/live-console';

export function Hero() {
    return (
        <section className="relative">
            <div className="bg-dots pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"/>

            <div className="relative mx-auto grid max-w-[1320px] items-center gap-12 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-28 lg:pt-20">
                <div className="animate-rise">
                    <h1 className="font-display text-[clamp(2.75rem,6.4vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-ink [font-stretch:88%]">
                        Hooks for the parts of React you keep{' '}
                        <span className="relative whitespace-nowrap text-accent">
                            rewriting<span className="animate-blink text-ink-3">_</span>
                        </span>
                    </h1>

                    <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-2">
                        {hookList.length} typed hooks for state, async data, realtime connections, gestures and
                        browser APIs. Each one is SSR-safe, cleans up after itself and ships with zero dependencies.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center gap-3">
                        <Link
                            href="/hooks"
                            className="group inline-flex h-12 items-center gap-2 rounded-xl bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-accent hover:text-accent-ink"
                        >
                            Browse hooks
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5"/>
                        </Link>
                        <a
                            href={SITE.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-12 items-center gap-2 rounded-xl border border-line-strong px-5 text-sm text-ink transition-colors hover:border-ink"
                        >
                            <GithubIcon width={16} height={16}/>
                            Source
                        </a>
                    </div>

                    <InstallCommand className="mt-8 max-w-md"/>
                </div>

                <div className="animate-rise [animation-delay:120ms]">
                    <LiveConsole/>
                </div>
            </div>
        </section>
    );
}
