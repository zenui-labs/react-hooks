import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {SITE, VERSION} from '@/lib/site';
import {hookList, hooksByCategory} from '@/data';
import {categorySlug} from '@/lib/slug';
import {InstallCommand} from '@/components/site/install-command';
import {Logo} from '@/components/site/logo';

export function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-line">
            {/* Brand glow rising from the wordmark. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(ellipse_60%_100%_at_50%_100%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_70%)]"
            />

            <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6">
                <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_2fr] lg:gap-20">
                    <div>
                        <Logo/>
                        <p className="mt-6 max-w-sm font-display text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink [font-stretch:90%]">
                            {hookList.length} hooks. One import.
                        </p>
                        <InstallCommand className="mt-6 max-w-sm"/>
                    </div>

                    <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
                        <FooterColumn title="Categories" links={hooksByCategory.map(({category}) => ({
                            href: `/hooks?category=${categorySlug(category)}`,
                            label: category,
                        }))}/>
                        <FooterColumn title="Library" links={[
                            {href: '/hooks', label: 'All hooks'},
                            {href: '/#whats-new', label: `New in v${VERSION}`},
                            {href: SITE.releases, label: 'Changelog', external: true},
                            {href: SITE.npm, label: 'npm package', external: true},
                        ]}/>
                        <FooterColumn title="Project" links={[
                            {href: SITE.github, label: 'GitHub', external: true},
                            {href: `${SITE.github}/issues`, label: 'Report a bug', external: true},
                            {href: SITE.org, label: 'ZenUI Labs', external: true},
                        ]}/>
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-line py-6 font-mono text-xs text-ink-3 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        A product of{' '}
                        <a href={SITE.org} target="_blank" rel="noopener noreferrer" className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent">
                            @zenui-labs
                        </a>
                    </p>
                    <p className="flex items-center gap-3">
                        <span>MIT license</span>
                        <span aria-hidden className="text-line-strong">/</span>
                        <a href={SITE.releases} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
                            v{VERSION}
                        </a>
                    </p>
                </div>
            </div>

            {/* Watermark. Decorative, so screen readers skip it. */}
            <p
                aria-hidden
                className="pointer-events-none relative -mb-[0.22em] select-none whitespace-nowrap text-center font-display text-[clamp(4rem,17vw,15rem)] font-semibold leading-none tracking-[-0.05em] text-transparent [font-stretch:85%]"
                style={{
                    backgroundImage: 'linear-gradient(to bottom, var(--line-strong), transparent 85%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                }}
            >
                react-hooks
            </p>
        </footer>
    );
}

function FooterColumn({title, links}: {
    title: string;
    links: { href: string; label: string; external?: boolean }[]
}) {
    return (
        <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">{title}</h2>
            <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                            className="group inline-flex items-center gap-1 text-sm text-ink-2 transition-colors hover:text-ink"
                        >
                            {link.label}
                            {link.external && (
                                <ArrowUpRight size={13} className="text-ink-3 transition-transform group-hover:-translate-y-px group-hover:translate-x-px"/>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
