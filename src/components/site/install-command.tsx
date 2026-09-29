'use client'

import {useEffect, useState} from 'react';
import {PACKAGE_MANAGERS, type PackageManager, SITE} from '@/lib/site';
import {CopyButton} from '@/components/site/copy-button';
import {cn} from '@/lib/cn';

const STORAGE_KEY = 'rh-pm';

/** Install command with a package manager switch. The choice is remembered. */
export function InstallCommand({className}: { className?: string }) {
    const [pm, setPm] = useState<PackageManager>('npm');

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (PACKAGE_MANAGERS.some((p) => p.id === saved)) setPm(saved as PackageManager);
        } catch {
            // Ignore blocked storage.
        }
    }, []);

    const choose = (id: PackageManager) => {
        setPm(id);
        try {
            localStorage.setItem(STORAGE_KEY, id);
        } catch {
            // Ignore blocked storage.
        }
    };

    const command = `${PACKAGE_MANAGERS.find((p) => p.id === pm)!.install} ${SITE.packageName}`;

    return (
        <div className={cn('overflow-hidden rounded-2xl border border-line bg-panel', className)}>
            <div className="flex items-center justify-between border-b border-line pl-1.5 pr-1.5">
                <div role="tablist" aria-label="Package manager" className="flex">
                    {PACKAGE_MANAGERS.map((p) => (
                        <button
                            key={p.id}
                            role="tab"
                            aria-selected={pm === p.id}
                            onClick={() => choose(p.id)}
                            className={cn(
                                'relative h-10 px-3 font-mono text-xs text-ink-3 transition-colors hover:text-ink',
                                pm === p.id && 'text-ink after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:bg-accent'
                            )}
                        >
                            {p.id}
                        </button>
                    ))}
                </div>
                <CopyButton text={command}/>
            </div>
            <div className="overflow-x-auto px-4 py-3.5 font-mono text-[13px]">
                <span className="select-none text-ink-3">$ </span>
                <span className="text-ink">{command}</span>
            </div>
        </div>
    );
}
