import type {HookLevel} from '@/types';
import {cn} from '@/lib/cn';

const STEPS: Record<HookLevel, number> = {basic: 1, intermediate: 2, advanced: 3};

export const LEVEL_LABEL: Record<HookLevel, string> = {
    basic: 'Basic',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
};

/** Three-step signal meter for a hook's complexity. */
export function LevelBars({level, showLabel, className}: { level: HookLevel; showLabel?: boolean; className?: string }) {
    const steps = STEPS[level];

    return (
        <span className={cn('inline-flex shrink-0 items-center gap-2', className)} title={LEVEL_LABEL[level]}>
            <span className="flex items-end gap-[3px]" aria-hidden>
                {[1, 2, 3].map((step) => (
                    <span
                        key={step}
                        className={cn('meter-bar w-[3px] rounded-full', step <= steps ? 'bg-accent' : 'bg-line-strong')}
                        style={{height: 4 + step * 3, '--i': step} as React.CSSProperties}
                    />
                ))}
            </span>
            {showLabel ? (
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">{LEVEL_LABEL[level]}</span>
            ) : (
                <span className="sr-only">{LEVEL_LABEL[level]}</span>
            )}
        </span>
    );
}
