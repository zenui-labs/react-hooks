'use client'

import {Check, Copy} from 'lucide-react';
import {useCopyToClipboard} from '@zenuilabs/react-hooks';
import {cn} from '@/lib/cn';

export function CopyButton({text, label = 'Copy', className}: { text: string; label?: string; className?: string }) {
    const {isCopied, copyToClipboard} = useCopyToClipboard();

    return (
        <button
            type="button"
            onClick={() => copyToClipboard(text)}
            aria-label={isCopied ? 'Copied' : label}
            className={cn(
                'inline-flex h-8 items-center gap-1.5 rounded-md border border-line bg-panel px-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 transition-colors hover:border-line-strong hover:text-ink',
                isCopied && 'border-signal bg-signal text-signal-ink hover:border-signal hover:text-signal-ink',
                className
            )}
        >
            {isCopied ? <Check size={13}/> : <Copy size={13}/>}
            <span aria-hidden>{isCopied ? 'Copied' : label}</span>
        </button>
    );
}
