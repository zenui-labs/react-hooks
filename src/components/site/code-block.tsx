'use client'

import type {CSSProperties} from 'react';
import {PrismLight as SyntaxHighlighter} from 'react-syntax-highlighter';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import {CopyButton} from '@/components/site/copy-button';
import {cn} from '@/lib/cn';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('bash', bash);

/*
 * Syntax theme built from CSS variables, so it follows the site theme with no
 * JavaScript. Four token colors only: keywords (accent), strings (ok), comments
 * (faint) and everything else (ink).
 */
const token = (color: string, extra: CSSProperties = {}): CSSProperties => ({color, ...extra});

const theme: Record<string, CSSProperties> = {
    'code[class*="language-"]': {color: 'var(--ink)', background: 'none', fontFamily: 'var(--font-mono)'},
    'pre[class*="language-"]': {color: 'var(--ink)', background: 'none', fontFamily: 'var(--font-mono)'},
    comment: token('var(--ink-3)', {fontStyle: 'italic'}),
    prolog: token('var(--ink-3)'),
    punctuation: token('var(--ink-2)'),
    keyword: token('var(--accent)'),
    'imports': token('var(--ink)'),
    boolean: token('var(--accent)'),
    number: token('var(--accent)'),
    string: token('var(--ok)'),
    'template-string': token('var(--ok)'),
    'attr-value': token('var(--ok)'),
    'attr-name': token('var(--ink-2)'),
    tag: token('var(--accent)'),
    function: token('var(--ink)', {fontWeight: 600}),
    'class-name': token('var(--ink)', {fontWeight: 600}),
    operator: token('var(--ink-2)'),
    builtin: token('var(--accent)'),
};

export function CodeBlock({code, language = 'tsx', title, className, maxHeight = 560}: {
    code: string;
    language?: 'tsx' | 'bash';
    title?: string;
    className?: string;
    maxHeight?: number;
}) {
    return (
        <div className={cn('overflow-hidden rounded-2xl border border-line bg-panel', className)}>
            <div className="flex h-11 items-center justify-between border-b border-line pl-4 pr-1.5">
                <span className="font-mono text-xs text-ink-3">{title ?? (language === 'bash' ? 'Terminal' : 'Example.tsx')}</span>
                <CopyButton text={code}/>
            </div>
            <div className="overflow-auto" style={{maxHeight}}>
                <SyntaxHighlighter
                    language={language}
                    style={theme}
                    customStyle={{margin: 0, padding: '1.1rem 1.25rem', background: 'transparent', fontSize: 13, lineHeight: 1.7}}
                    codeTagProps={{style: {fontFamily: 'var(--font-mono)', fontVariantLigatures: 'none'}}}
                >
                    {code.trim()}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}
