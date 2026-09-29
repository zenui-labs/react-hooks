'use client'

import {useRef, useState} from 'react';
import {useScrollSpy} from '@zenuilabs/react-hooks';
import {Button, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const SECTIONS = [
    {id: 'spy-demo-overview', title: 'Overview', paragraphs: 2},
    {id: 'spy-demo-install', title: 'Install', paragraphs: 1},
    {id: 'spy-demo-configure', title: 'Configure', paragraphs: 3},
    {id: 'spy-demo-deploy', title: 'Deploy', paragraphs: 2},
    {id: 'spy-demo-faq', title: 'FAQ', paragraphs: 1},
];

const IDS = SECTIONS.map((section) => section.id);
const OFFSETS = [0, 48];

const FILLER = 'This paragraph stands in for real documentation. Scroll the article and watch the navigation follow along. The active entry is the topmost section that is still visible below the offset line.';

export default function UseScrollSpyDemo() {
    const rootRef = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState(0);
    const activeId = useScrollSpy(IDS, {root: rootRef, offset});
    const activeIndex = IDS.indexOf(activeId ?? '');

    const goTo = (id: string) => {
        const root = rootRef.current;
        const section = document.getElementById(id);
        if (!root || !section) return;
        // Scroll only the article, not the page around it.
        root.scrollTo({top: section.offsetTop - offset, behavior: 'smooth'});
    };

    return (
        <Stage>
            <StageHeader
                title="Follow the article"
                hint="Scroll the article on the right. The nav highlights the section you are reading. Click a link to jump."
            />
            <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
                    <nav aria-label="Article sections" className="flex gap-1 overflow-x-auto sm:flex-col">
                        {SECTIONS.map((section) => {
                            const active = section.id === activeId;
                            return (
                                <button
                                    key={section.id}
                                    type="button"
                                    onClick={() => goTo(section.id)}
                                    aria-current={active ? 'location' : undefined}
                                    className={
                                        'shrink-0 rounded-lg border-l-2 px-3 py-1.5 text-left text-sm transition-colors '
                                        + (active ? 'border-accent bg-accent-soft font-medium text-ink' : 'border-transparent text-ink-2 hover:text-ink')
                                    }
                                >
                                    {section.title}
                                </button>
                            );
                        })}
                    </nav>
                    <div className="relative">
                        <div ref={rootRef} className="relative h-72 overflow-y-auto rounded-xl border border-line bg-paper/70 px-5">
                            {SECTIONS.map((section) => (
                                <section key={section.id} id={section.id} className="border-b border-line py-5 last:border-b-0">
                                    <h4 className="font-display text-base font-semibold text-ink">{section.title}</h4>
                                    {Array.from({length: section.paragraphs}, (_, i) => (
                                        <p key={i} className="mt-2 text-sm leading-relaxed text-ink-2">{FILLER}</p>
                                    ))}
                                </section>
                            ))}
                        </div>
                        {offset > 0 && (
                            <div
                                className="pointer-events-none absolute inset-x-px top-px border-b border-dashed border-accent bg-accent-soft/60"
                                style={{height: offset}}
                            >
                                <span className="absolute right-2 top-1 font-mono text-[10px] uppercase tracking-[0.08em] text-accent">
                                    offset {offset}px
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <Row>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">options.offset</span>
                    {OFFSETS.map((value) => (
                        <Button key={value} size="sm" variant={value === offset ? 'primary' : 'secondary'} onClick={() => setOffset(value)}>
                            {value}px
                        </Button>
                    ))}
                </Row>
                <ReadoutGrid cols={3}>
                    <Readout label="activeId" value={activeId ?? 'null'} tone="accent"/>
                    <Readout label="Section" value={activeIndex >= 0 ? `${activeIndex + 1} of ${IDS.length}` : 'none'}/>
                    <Readout label="options.root" value="article element"/>
                </ReadoutGrid>
                <Note>
                    The offset band stands in for a sticky header: a section that only shows under it does not count.
                    At the very end of the article the last section wins, even when it is short.
                </Note>
            </div>
        </Stage>
    );
}
