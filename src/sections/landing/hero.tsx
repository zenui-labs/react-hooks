import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {hookList} from '@/data';
import {InstallCommand} from '@/components/site/install-command';
import {GithubIcon} from '@/components/site/icons';
import {isNewInRelease, SITE, VERSION} from '@/lib/site';
import {LiveConsole} from '@/sections/landing/live-console';

export function Hero() {
    const added = hookList.filter((hook) => isNewInRelease(hook.since)).length;

    return (
        <section className="relative">
            <div className="bg-dots pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"/>

            <div className="relative mx-auto grid max-w-[1320px] items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:pb-24 lg:pt-14">
                <div className="animate-rise">
                    <Link
                        href="/#whats-new"
                        className="group mb-5 inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-panel/70 py-1 pl-1 pr-3.5 text-sm text-ink-2 backdrop-blur transition-colors hover:border-ink hover:text-ink"
                    >
                        <span className="rounded-full bg-signal px-2 py-0.5 font-mono text-[11px] font-medium text-signal-ink">v{VERSION}</span>
                        {added > 0 ? `${added} new hooks in this release` : 'Release notes'}
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5"/>
                    </Link>

                    <h1 className="font-display text-[clamp(2.4rem,4.8vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink [font-stretch:88%]">
                        Hooks for the parts of React you keep{' '}
                        <span className="relative whitespace-nowrap text-accent">
                            rewriting<span className="animate-blink text-ink-3">_</span>
                        </span>
                    </h1>

                    <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-2 sm:text-[17px]">
                        {hookList.length} typed hooks for state, async data, realtime connections, gestures and
                        browser APIs. Each one is SSR-safe, cleans up after itself and ships with zero dependencies.
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                        <Link
                            href="/hooks"
                            className="group inline-flex h-11 items-center gap-2 rounded-xl bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-accent hover:text-accent-ink"
                        >
                            Browse hooks
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5"/>
                        </Link>
                        <a
                            href={SITE.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-11 items-center gap-2 rounded-xl border border-line-strong px-5 text-sm text-ink transition-colors hover:border-ink"
                        >
                            <GithubIcon width={16} height={16}/>
                            Source
                        </a>
                    </div>

                    <InstallCommand className="mt-6 max-w-md"/>
                </div>

                <div className="animate-rise [animation-delay:120ms]">
                    <LiveConsole/>
                </div>
            </div>
        </section>
    );
}
