'use client'

import {useEffect, useState} from 'react';
import {Play} from 'lucide-react';
import type {HookEntry} from '@/types';
import {demoRegistry} from '@/components/hook-examples/registry';
import {CodeBlock} from '@/components/site/code-block';
import {InstallCommand} from '@/components/site/install-command';
import {openInStackBlitz} from '@/lib/stackblitz';
import {cn} from '@/lib/cn';

const TABS = [
    {id: 'demo', label: 'Demo'},
    {id: 'code', label: 'Code'},
    {id: 'api', label: 'API'},
] as const;

type TabId = (typeof TABS)[number]['id'];

export function HookTabs({hook}: { hook: HookEntry }) {
    const [tab, setTab] = useState<TabId>('demo');
    const Demo = demoRegistry[hook.slug];

    // Deep links: /hooks/usefoo#api opens the API tab.
    useEffect(() => {
        const fromHash = TABS.find((t) => `#${t.id}` === window.location.hash)?.id;
        if (fromHash) setTab(fromHash);
    }, [hook.slug]);

    const select = (id: TabId) => {
        setTab(id);
        history.replaceState(null, '', id === 'demo' ? window.location.pathname : `#${id}`);
    };

    return (
        <div>
            <div className="flex items-center justify-between gap-4 border-b border-line">
                <div role="tablist" aria-label="Hook documentation" className="flex">
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            role="tab"
                            id={`tab-${t.id}`}
                            aria-selected={tab === t.id}
                            aria-controls={`panel-${t.id}`}
                            onClick={() => select(t.id)}
                            className={cn(
                                'relative h-12 px-4 text-sm transition-colors first:pl-0',
                                tab === t.id ? 'text-ink after:absolute after:inset-x-4 after:-bottom-px after:h-0.5 after:bg-accent first:after:left-0' : 'text-ink-3 hover:text-ink'
                            )}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => openInStackBlitz(hook)}
                    className="inline-flex h-8 items-center gap-2 rounded-lg border border-line px-3 text-xs text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
                >
                    <Play size={12}/>
                    <span className="hidden sm:inline">Open in StackBlitz</span>
                    <span className="sm:hidden">StackBlitz</span>
                </button>
            </div>

            <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="pt-6">
                {tab === 'demo' && (Demo ? <Demo/> : <MissingDemo name={hook.name}/>)}
                {tab === 'code' && (
                    <div className="space-y-4">
                        <InstallCommand/>
                        <CodeBlock code={hook.usage} title={`${hook.name}.example.tsx`}/>
                    </div>
                )}
                {tab === 'api' && <ApiReference hook={hook}/>}
            </div>
        </div>
    );
}

function MissingDemo({name}: { name: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-line-strong p-10 text-center text-sm text-ink-2">
            The live demo for <span className="font-mono text-ink">{name}</span> is not ready yet. The Code tab has a
            working example.
        </div>
    );
}

function ApiReference({hook}: { hook: HookEntry }) {
    return (
        <div className="space-y-10">
            <section>
                <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">Signature</h2>
                <pre className="overflow-x-auto rounded-xl border border-line bg-panel px-4 py-3.5 font-mono text-[13px] leading-relaxed text-ink">
                    <code>{hook.signature}</code>
                </pre>
            </section>
            <ApiTable title="Parameters" nameLabel="Parameter" rows={hook.api.map((p) => ({name: p.param, type: p.type, description: p.description}))}
                      empty="This hook takes no parameters."/>
            <ApiTable title="Returns" nameLabel="Value" rows={hook.returns} empty="This hook returns nothing."/>
        </div>
    );
}

function ApiTable({title, nameLabel, rows, empty}: {
    title: string;
    nameLabel: string;
    rows: { name: string; type: string; description: string }[];
    empty: string;
}) {
    return (
        <section>
            <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">{title}</h2>
            {rows.length === 0 ? (
                <p className="text-sm text-ink-2">{empty}</p>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-line">
                    <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                        <thead>
                        <tr className="border-b border-line bg-panel font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                            <th scope="col" className="w-[26%] px-4 py-2.5 font-normal">{nameLabel}</th>
                            <th scope="col" className="w-[30%] px-4 py-2.5 font-normal">Type</th>
                            <th scope="col" className="px-4 py-2.5 font-normal">Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((row) => (
                            <tr key={row.name} className="border-b border-line align-top last:border-0">
                                <td className="px-4 py-3 font-mono text-[13px] text-ink">{row.name}</td>
                                <td className="px-4 py-3 font-mono text-[12px] leading-relaxed text-accent">{row.type}</td>
                                <td className="px-4 py-3 leading-relaxed text-ink-2">{row.description}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
