import Link from 'next/link';
import {SITE} from '@/lib/site';
import {hookList} from '@/data';

export function Footer() {
    return (
        <footer className="border-t border-line">
            <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
                <div>
                    <p className="font-display text-2xl font-semibold tracking-tight text-ink">
                        {hookList.length} hooks. One import.
                    </p>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-2">
                        Open source under the MIT license. Built and maintained by{' '}
                        <a href={SITE.org} target="_blank" rel="noopener noreferrer" className="text-ink underline decoration-line-strong underline-offset-4 hover:decoration-accent">
                            ZenUI Labs
                        </a>.
                    </p>
                </div>
                <FooterColumn title="Library" links={[
                    {href: '/hooks', label: 'All hooks'},
                    {href: SITE.releases, label: 'Changelog', external: true},
                    {href: SITE.npm, label: 'npm package', external: true},
                ]}/>
                <FooterColumn title="Project" links={[
                    {href: SITE.github, label: 'GitHub', external: true},
                    {href: `${SITE.github}/issues`, label: 'Report a bug', external: true},
                    {href: SITE.org, label: 'ZenUI Labs', external: true},
                ]}/>
            </div>
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
                            className="text-sm text-ink-2 transition-colors hover:text-ink"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
