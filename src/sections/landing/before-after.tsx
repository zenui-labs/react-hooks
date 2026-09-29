'use client'

import {useState} from 'react';
import {CodeBlock} from '@/components/site/code-block';
import {cn} from '@/lib/cn';

const BY_HAND = `import {useEffect, useState} from 'react';

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      const raw = window.localStorage.getItem('theme');
      return raw ? JSON.parse(raw) : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('theme', JSON.stringify(theme));
    } catch {}
  }, [theme]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'theme' || event.newValue === null) return;
      setTheme(JSON.parse(event.newValue));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return [theme, setTheme] as const;
}`;

const WITH_HOOK = `import {useLocalStorage} from '@zenuilabs/react-hooks';

function useTheme() {
  const {storedValue, setValue} = useLocalStorage('theme', 'light');
  return [storedValue, setValue] as const;
}`;

const MODES = [
    {id: 'hand', label: 'By hand', code: BY_HAND},
    {id: 'hook', label: 'With the hook', code: WITH_HOOK},
] as const;

const lines = (code: string) => code.split('\n').length;

export function BeforeAfter() {
    const [mode, setMode] = useState<(typeof MODES)[number]['id']>('hand');
    const active = MODES.find((m) => m.id === mode)!;

    return (
        <section className="mx-auto max-w-[1320px] px-4 py-24 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
                <div className="lg:pt-6">
                    <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-5xl [font-stretch:90%]">
                        Delete the effect you wrote last sprint.
                    </h2>
                    <p className="mt-6 max-w-md leading-relaxed text-ink-2">
                        Persisting a value sounds like one line of work. In practice it needs a server check, a
                        parse guard, a write effect and a listener for other tabs. The hook does all four, and
                        it is tested in Node, so it never breaks a server render.
                    </p>

                    <div className="mt-10 flex items-end gap-8 font-mono">
                        <Figure label="By hand" value={lines(BY_HAND)} dim={mode !== 'hand'}/>
                        <Figure label="With the hook" value={lines(WITH_HOOK)} dim={mode !== 'hook'} accent/>
                    </div>
                </div>

                <div>
                    <div role="tablist" aria-label="Code comparison" className="mb-3 inline-flex rounded-xl border border-line bg-panel p-1">
                        {MODES.map((m) => (
                            <button
                                key={m.id}
                                role="tab"
                                aria-selected={mode === m.id}
                                onClick={() => setMode(m.id)}
                                className={cn(
                                    'h-9 rounded-lg px-4 text-sm transition-colors',
                                    mode === m.id ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'
                                )}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                    <CodeBlock key={mode} code={active.code} title="use-theme.ts" className="animate-rise" maxHeight={2000}/>
                </div>
            </div>
        </section>
    );
}

function Figure({label, value, dim, accent}: { label: string; value: number; dim: boolean; accent?: boolean }) {
    return (
        <div className={cn('transition-opacity duration-300', dim && 'opacity-40')}>
            <div className={cn('text-6xl font-medium tabular-nums tracking-tight', accent ? 'text-accent' : 'text-ink')}>{value}</div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.08em] text-ink-3">{label}, lines</div>
        </div>
    );
}
