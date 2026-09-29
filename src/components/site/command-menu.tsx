'use client'

import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Command} from 'cmdk';
import * as Dialog from '@radix-ui/react-dialog';
import {ArrowRight, Moon, Package, Search} from 'lucide-react';
import type {HookCategory, HookSummary} from '@/types';
import {useSiteTheme} from '@/lib/theme';
import {SITE} from '@/lib/site';
import {LevelBars} from '@/components/site/level';
import {cn} from '@/lib/cn';

const CommandMenuContext = createContext<{ open: () => void }>({open: () => undefined});

export const useCommandMenu = () => useContext(CommandMenuContext);

/** Global ⌘K / Ctrl+K palette for jumping to any hook. */
export function CommandMenuProvider({children, groups}: {
    children: React.ReactNode;
    groups: { category: HookCategory; hooks: HookSummary[] }[];
}) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const {toggle} = useSiteTheme();

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setOpen((value) => !value);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const run = useCallback((action: () => void) => {
        setOpen(false);
        action();
    }, []);

    const value = useMemo(() => ({open: () => setOpen(true)}), []);

    return (
        <CommandMenuContext.Provider value={value}>
            {children}
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-[80] bg-paper/70 backdrop-blur-sm data-[state=open]:animate-[rise_0.2s_ease-out]"/>
                    <Dialog.Content
                        aria-describedby={undefined}
                        className="fixed left-1/2 top-[12vh] z-[90] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-line-strong bg-panel shadow-[0_30px_80px_-20px_rgb(0_0_0/0.45)]"
                    >
                        <Dialog.Title className="sr-only">Search hooks</Dialog.Title>
                        <Command loop className="flex max-h-[70vh] flex-col">
                            <div className="flex items-center gap-3 border-b border-line px-4">
                                <Search size={16} className="shrink-0 text-ink-3"/>
                                <Command.Input
                                    autoFocus
                                    placeholder="Search hooks, e.g. storage, drag, socket"
                                    className="h-13 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3"
                                />
                                <kbd className="rounded border border-line px-1.5 font-mono text-[10px] text-ink-3">ESC</kbd>
                            </div>
                            <Command.List className="overflow-y-auto p-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.08em] [&_[cmdk-group-heading]]:text-ink-3">
                                <Command.Empty className="px-3 py-10 text-center text-sm text-ink-3">
                                    No hook matches that. Try a browser API or an event name.
                                </Command.Empty>

                                {groups.map(({category, hooks}) => (
                                    <Command.Group key={category} heading={category}>
                                        {hooks.map((hook) => (
                                            <Command.Item
                                                key={hook.slug}
                                                value={`${hook.name} ${hook.category} ${hook.description}`}
                                                onSelect={() => run(() => router.push(`/hooks/${hook.slug}`))}
                                                className={itemClass}
                                            >
                                                <span className="font-mono text-[13px] text-ink">{hook.name}</span>
                                                <span className="hidden min-w-0 flex-1 truncate text-xs text-ink-3 sm:block">{hook.description}</span>
                                                <LevelBars level={hook.level}/>
                                            </Command.Item>
                                        ))}
                                    </Command.Group>
                                ))}

                                <Command.Group heading="Actions">
                                    <Command.Item value="toggle theme dark light" onSelect={() => run(toggle)} className={itemClass}>
                                        <Moon size={15} className="text-ink-3"/>
                                        <span className="text-sm text-ink">Toggle theme</span>
                                    </Command.Item>
                                    <Command.Item value="copy install command npm" onSelect={() => run(() => navigator.clipboard?.writeText(`npm install ${SITE.packageName}`))} className={itemClass}>
                                        <Package size={15} className="text-ink-3"/>
                                        <span className="text-sm text-ink">Copy install command</span>
                                    </Command.Item>
                                    <Command.Item value="all hooks index browse" onSelect={() => run(() => router.push('/hooks'))} className={itemClass}>
                                        <ArrowRight size={15} className="text-ink-3"/>
                                        <span className="text-sm text-ink">Browse all hooks</span>
                                    </Command.Item>
                                </Command.Group>
                            </Command.List>
                        </Command>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </CommandMenuContext.Provider>
    );
}

const itemClass = cn(
    'flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 outline-none',
    'data-[selected=true]:bg-panel-2 data-[selected=true]:[&>span:first-child]:text-accent'
);

export function SearchTrigger({className}: { className?: string }) {
    const {open} = useCommandMenu();
    const [isMac, setIsMac] = useState(true);

    useEffect(() => {
        setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    }, []);

    return (
        <button
            type="button"
            onClick={open}
            className={cn(
                'group flex h-9 items-center gap-2.5 rounded-lg border border-line bg-panel pl-3 pr-1.5 text-sm text-ink-3 transition-colors hover:border-line-strong hover:text-ink-2',
                className
            )}
        >
            <Search size={15}/>
            <span className="mr-4">Search hooks</span>
            <kbd className="ml-auto rounded border border-line bg-paper px-1.5 py-0.5 font-mono text-[10px] text-ink-3">
                {isMac ? '⌘' : 'Ctrl'} K
            </kbd>
        </button>
    );
}
