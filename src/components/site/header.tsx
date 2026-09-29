'use client'

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Menu, Search, X} from 'lucide-react';
import {Logo} from '@/components/site/logo';
import {ThemeToggle} from '@/components/site/theme-toggle';
import {SearchTrigger, useCommandMenu} from '@/components/site/command-menu';
import {GithubIcon} from '@/components/site/icons';
import {SITE, VERSION} from '@/lib/site';
import {cn} from '@/lib/cn';

const NAV = [
    {href: '/hooks', label: 'Hooks'},
    {href: SITE.releases, label: 'Changelog', external: true},
    {href: SITE.npm, label: 'npm', external: true},
];

export function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const {open: openSearch} = useCommandMenu();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, {passive: true});
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => setMenuOpen(false), [pathname]);

    return (
        <header
            className={cn(
                'sticky top-0 z-50 border-b transition-colors duration-200',
                scrolled || menuOpen ? 'border-line bg-paper/85 backdrop-blur-md' : 'border-transparent bg-transparent'
            )}
        >
            <div className="mx-auto flex h-15 max-w-[1320px] items-center gap-6 px-4 sm:px-6">
                <Logo/>
                <a
                    href={SITE.releases}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-ml-3 hidden rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-ink-3 transition-colors hover:border-line-strong hover:text-ink sm:inline-block"
                >
                    v{VERSION}
                </a>

                <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Main">
                    {NAV.map((item) => {
                        const active = !item.external && pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                target={item.external ? '_blank' : undefined}
                                rel={item.external ? 'noopener noreferrer' : undefined}
                                className={cn(
                                    'rounded-md px-3 py-1.5 text-sm transition-colors hover:text-ink',
                                    active ? 'text-ink' : 'text-ink-2'
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="ml-auto flex items-center gap-1.5">
                    <SearchTrigger className="hidden sm:flex"/>
                    <button
                        type="button"
                        onClick={openSearch}
                        aria-label="Search hooks"
                        className="grid size-9 place-items-center rounded-lg text-ink-2 hover:bg-panel-2 hover:text-ink sm:hidden"
                    >
                        <Search size={17}/>
                    </button>
                    <ThemeToggle/>
                    <a
                        href={SITE.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub repository"
                        className="hidden size-9 place-items-center rounded-lg text-ink-2 transition-colors hover:bg-panel-2 hover:text-ink sm:grid"
                    >
                        <GithubIcon/>
                    </a>
                    <button
                        type="button"
                        onClick={() => setMenuOpen((value) => !value)}
                        aria-expanded={menuOpen}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        className="grid size-9 place-items-center rounded-lg text-ink-2 hover:bg-panel-2 hover:text-ink md:hidden"
                    >
                        {menuOpen ? <X size={18}/> : <Menu size={18}/>}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <nav className="border-t border-line px-4 pb-4 pt-2 md:hidden" aria-label="Mobile">
                    {[...NAV, {href: SITE.github, label: 'GitHub', external: true}].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            target={item.external ? '_blank' : undefined}
                            rel={item.external ? 'noopener noreferrer' : undefined}
                            className="flex items-center justify-between border-b border-line py-3.5 font-display text-2xl text-ink last:border-0"
                        >
                            {item.label}
                            <span className="font-mono text-xs text-ink-3">{item.external ? 'external' : ''}</span>
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    );
}
