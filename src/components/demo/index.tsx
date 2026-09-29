'use client'

/*
 * Demo kit. Every live demo on /hooks/[slug] is built from these pieces so the
 * playgrounds share one visual language: a panel stage, mono readouts for state,
 * a lime LED for anything "live", and a small set of buttons and inputs.
 *
 * Rules for demos:
 * - Show the hook's state, not decoration. Every readout maps to a return value.
 * - One primary action per demo. Secondary actions use variant="secondary".
 * - Copy is short and literal: say what to do and what changes.
 */

import React from 'react';
import {cn} from '@/lib/cn';

/* ---------- Layout ---------- */

export function Stage({children, className}: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn('relative overflow-hidden rounded-2xl border border-line bg-panel bg-dots p-4 sm:p-8', className)}>
            {children}
        </div>
    );
}

export function StageHeader({title, hint, live}: { title: string; hint?: React.ReactNode; live?: boolean }) {
    return (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
                <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{title}</h3>
                {hint && <p className="mt-1 max-w-prose text-sm text-ink-2">{hint}</p>}
            </div>
            {live !== undefined && <Led on={live} label={live ? 'Live' : 'Idle'}/>}
        </div>
    );
}

export function Row({children, className}: { children: React.ReactNode; className?: string }) {
    return <div className={cn('flex flex-wrap items-center gap-2', className)}>{children}</div>;
}

/* ---------- Readouts ---------- */

export function Readout({label, value, live, tone, className}: {
    label: string;
    value: React.ReactNode;
    live?: boolean;
    tone?: 'default' | 'accent' | 'signal' | 'danger' | 'ok';
    className?: string;
}) {
    const toneClass = {
        default: 'text-ink',
        accent: 'text-accent',
        signal: 'text-ink',
        danger: 'text-danger',
        ok: 'text-ok',
    }[tone ?? 'default'];

    return (
        <div className={cn('min-w-0 rounded-xl border border-line bg-paper/70 px-3.5 py-3 backdrop-blur-sm', className)}>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                {live !== undefined && <span className="led" data-on={live}/>}
                {label}
            </div>
            <div className={cn(
                'mt-1.5 truncate font-mono text-lg tabular-nums',
                toneClass,
                tone === 'signal' && 'inline-block rounded bg-signal px-1.5 text-signal-ink'
            )}>
                {value}
            </div>
        </div>
    );
}

export function ReadoutGrid({children, cols = 3, className}: {
    children: React.ReactNode;
    cols?: 2 | 3 | 4;
    className?: string
}) {
    const colClass = {2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4'}[cols];
    return <div className={cn('grid grid-cols-1 gap-2', colClass, className)}>{children}</div>;
}

export function Led({on, label, tone}: { on: boolean; label?: string; tone?: 'danger' }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2">
            <span className="led" data-on={on} data-tone={tone}/>
            {label}
        </span>
    );
}

export function Meter({value, max = 100, label}: { value: number; max?: number; label?: string }) {
    const pct = max === 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
    return (
        <div>
            {label && (
                <div className="mb-1.5 flex justify-between font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                    <span>{label}</span>
                    <span className="tabular-nums">{Math.round(pct)}%</span>
                </div>
            )}
            <div className="h-2 overflow-hidden rounded-full bg-panel-2" role="progressbar" aria-valuenow={value}
                 aria-valuemin={0} aria-valuemax={max}>
                <div className="h-full rounded-full bg-accent transition-[width] duration-200" style={{width: `${pct}%`}}/>
            </div>
        </div>
    );
}

/** Event log, newest entry first. Pass pre-formatted strings. */
export function Log({entries, empty = 'Nothing logged yet.', className}: {
    entries: React.ReactNode[];
    empty?: string;
    className?: string
}) {
    return (
        <div className={cn('max-h-56 overflow-auto rounded-xl border border-line bg-paper/80 p-3 font-mono text-xs', className)}>
            {entries.length === 0 ? (
                <p className="text-ink-3">{empty}</p>
            ) : (
                <ol className="space-y-1">
                    {entries.map((entry, i) => (
                        <li key={i} className={cn('flex gap-3', i === 0 ? 'text-ink' : 'text-ink-2')}>
                            <span className="select-none text-ink-3">{String(entries.length - i).padStart(2, '0')}</span>
                            <span className="min-w-0 break-words">{entry}</span>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}

/* ---------- Controls ---------- */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md';
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {variant = 'primary', size = 'md', className, type = 'button', ...props}, ref
) {
    return (
        <button
            ref={ref}
            type={type}
            className={cn(
                'inline-flex select-none items-center justify-center gap-2 rounded-lg font-medium transition-[background,color,border,transform] duration-150 active:translate-y-px disabled:opacity-45',
                size === 'sm' ? 'h-8 px-3 text-[13px]' : 'h-10 px-4 text-sm',
                variant === 'primary' && 'bg-ink text-paper hover:bg-accent hover:text-accent-ink',
                variant === 'secondary' && 'border border-line-strong bg-panel text-ink hover:border-ink',
                variant === 'ghost' && 'text-ink-2 hover:bg-panel-2 hover:text-ink',
                variant === 'danger' && 'border border-danger/40 text-danger hover:bg-danger hover:text-white',
                className
            )}
            {...props}
        />
    );
});

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    function Input({className, ...props}, ref) {
        return (
            <input
                ref={ref}
                className={cn(
                    'h-10 w-full rounded-lg border border-line-strong bg-paper px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-accent',
                    className
                )}
                {...props}
            />
        );
    }
);

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    function Textarea({className, ...props}, ref) {
        return (
            <textarea
                ref={ref}
                className={cn(
                    'w-full rounded-lg border border-line-strong bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-accent',
                    className
                )}
                {...props}
            />
        );
    }
);

export function Field({label, children, hint}: { label: string; children: React.ReactNode; hint?: string }) {
    return (
        <label className="block">
            <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">{label}</span>
            {children}
            {hint && <span className="mt-1.5 block text-xs text-ink-3">{hint}</span>}
        </label>
    );
}

export function Kbd({children}: { children: React.ReactNode }) {
    return (
        <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-line-strong border-b-2 bg-panel px-1.5 font-mono text-[11px] text-ink-2">
            {children}
        </kbd>
    );
}

export function Note({children, className}: { children: React.ReactNode; className?: string }) {
    return <p className={cn('text-xs leading-relaxed text-ink-3', className)}>{children}</p>;
}

/** Shown when a demo depends on a browser API that is missing. */
export function Unsupported({api}: { api: string }) {
    return (
        <div className="rounded-xl border border-dashed border-line-strong p-4 text-sm text-ink-2">
            <span className="font-mono text-ink">{api}</span> is not available in this browser. The hook
            returns <span className="font-mono">isSupported: false</span> and does nothing.
        </div>
    );
}

/** A dashed target area for pointer, drag and drop demos. */
export const Pad = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { active?: boolean }>(
    function Pad({className, active, ...props}, ref) {
        return (
            <div
                ref={ref}
                data-active={active}
                className={cn(
                    'relative flex min-h-40 items-center justify-center rounded-xl border-2 border-dashed border-line-strong bg-paper/60 p-6 text-center text-sm text-ink-2 transition-colors',
                    'data-[active=true]:border-accent data-[active=true]:bg-accent-soft data-[active=true]:text-ink',
                    className
                )}
                {...props}
            />
        );
    }
);
