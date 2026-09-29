'use client'

import {useState} from 'react';
import {useIntersection} from '@zenuilabs/react-hooks';
import {cn} from '@/lib/cn';
import {Button, Meter, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const THRESHOLDS = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1];

function Scene({once}: { once: boolean }) {
    const [root, setRoot] = useState<HTMLDivElement | null>(null);
    const {ref, isIntersecting, entry} = useIntersection<HTMLDivElement>({root, threshold: THRESHOLDS, once});
    const ratio = entry?.intersectionRatio ?? 0;

    return (
        <div className="space-y-4">
            <div ref={setRoot} className="h-64 overflow-y-auto overscroll-contain rounded-xl border border-line bg-panel-2">
                <p className="p-3 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">Scroll down</p>
                <div className="h-56"/>
                <div
                    ref={ref}
                    className={cn(
                        'mx-auto flex h-28 w-4/5 items-center justify-center rounded-xl border-2 font-mono text-sm transition-colors duration-200',
                        isIntersecting ? 'border-accent bg-accent-soft text-ink' : 'border-dashed border-line-strong bg-paper text-ink-3'
                    )}
                >
                    {isIntersecting ? (once ? 'Seen' : 'In view') : 'Out of view'}
                </div>
                <div className="h-56"/>
            </div>
            <Meter label="entry.intersectionRatio" value={ratio} max={1}/>
            <ReadoutGrid>
                <Readout label="isIntersecting" value={String(isIntersecting)} live={isIntersecting} tone={isIntersecting ? 'signal' : 'default'}/>
                <Readout label="ratio" value={ratio.toFixed(2)}/>
                <Readout label="entry" value={entry ? 'IntersectionObserverEntry' : 'null'}/>
            </ReadoutGrid>
        </div>
    );
}

export default function UseIntersectionDemo() {
    const [once, setOnce] = useState(false);

    return (
        <Stage>
            <StageHeader
                title="Scroll the box"
                hint="The card is observed inside the scroll container. Turn on once and the card stays marked as seen after it first appears."
            />
            <div className="space-y-4">
                <Row>
                    <Button variant="secondary" onClick={() => setOnce(!once)}>once: {String(once)}</Button>
                </Row>
                <Scene key={String(once)} once={once}/>
            </div>
        </Stage>
    );
}
