'use client'

import {useRef, useState} from 'react';
import {Copy, Quote, X} from 'lucide-react';
import {useTextSelection} from '@zenuilabs/react-hooks';
import {Button, Log, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const PARAGRAPHS = [
    'The lighthouse keeper wrote the same line in the log every night: lamp lit, glass clean, sea calm or not. Nobody read the log, but the habit kept the lamp burning for forty years.',
    'Small routines outlast big plans. A plan needs a reason to continue; a routine only needs the next evening. Select any phrase in this article to quote or copy it.',
];

export default function UseTextSelectionDemo() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const articleRef = useRef<HTMLElement>(null);
    const [scoped, setScoped] = useState(true);
    const [quotes, setQuotes] = useState<string[]>([]);
    const {text, rect, isCollapsed, clear} = useTextSelection(scoped ? articleRef : undefined);

    // rect is in viewport coordinates; convert it to the wrapper's coordinates for an absolute toolbar.
    const wrapperRect = wrapperRef.current?.getBoundingClientRect();
    const toolbar = rect && wrapperRect && text
        ? {top: rect.top - wrapperRect.top - 44, left: rect.left - wrapperRect.left + rect.width / 2}
        : null;

    const addQuote = () => {
        setQuotes((previous) => [`"${text.trim()}"`, ...previous].slice(0, 10));
        clear();
    };

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setQuotes((previous) => [`copied ${text.length} characters`, ...previous].slice(0, 10));
        } catch {
            setQuotes((previous) => ['clipboard permission denied', ...previous].slice(0, 10));
        }
    };

    return (
        <Stage>
            <StageHeader
                title="Select some text"
                hint="Highlight words in the article. A toolbar appears over the selection and follows it when you scroll."
                live={!isCollapsed}
            />
            <div className="space-y-4">
                <div ref={wrapperRef} className="relative">
                    <article ref={articleRef} className="space-y-3 rounded-xl border border-line bg-paper/70 p-5 text-[15px] leading-relaxed text-ink-2 selection:bg-accent-soft selection:text-ink">
                        {PARAGRAPHS.map((paragraph) => <p key={paragraph.slice(0, 12)}>{paragraph}</p>)}
                    </article>
                    <p className="mt-3 px-1 text-sm text-ink-3">
                        This line is outside the article. With the scope on, selecting it hides the toolbar.
                    </p>
                    {toolbar && (
                        <div
                            role="toolbar"
                            aria-label="Selection actions"
                            className="absolute z-10 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-line-strong bg-panel p-1 shadow-lg"
                            style={{top: Math.max(-8, toolbar.top), left: toolbar.left}}
                            // Keep the selection alive when a toolbar button is pressed.
                            onMouseDown={(event) => event.preventDefault()}
                        >
                            <Button size="sm" variant="ghost" onClick={addQuote}><Quote className="size-3.5"/>Quote</Button>
                            <Button size="sm" variant="ghost" onClick={copy}><Copy className="size-3.5"/>Copy</Button>
                            <Button size="sm" variant="ghost" aria-label="Clear selection" onClick={clear}><X className="size-3.5"/></Button>
                        </div>
                    )}
                </div>
                <Row>
                    <Button size="sm" variant={scoped ? 'primary' : 'secondary'} onClick={() => setScoped((on) => !on)}>
                        {scoped ? 'Limited to the article' : 'Whole document'}
                    </Button>
                </Row>
                <ReadoutGrid cols={4}>
                    <Readout label="text" value={text ? `"${text.trim()}"` : 'empty'} className="sm:col-span-2" tone={text ? 'accent' : 'default'}/>
                    <Readout label="isCollapsed" value={String(isCollapsed)}/>
                    <Readout label="rect" value={rect ? `${Math.round(rect.width)} x ${Math.round(rect.height)}` : 'null'}/>
                </ReadoutGrid>
                <Log entries={quotes} empty="Quoted and copied text shows up here."/>
            </div>
        </Stage>
    );
}
