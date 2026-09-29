'use client'

import {useRef} from 'react';
import {ArrowDown, ArrowLeft, ArrowRight, ArrowUp} from 'lucide-react';
import {useScroll} from '@zenuilabs/react-hooks';
import {Meter, Readout, ReadoutGrid, Stage, StageHeader} from '@/components/demo';

const ICONS = {up: ArrowUp, down: ArrowDown, left: ArrowLeft, right: ArrowRight};

export default function UseScrollDemo() {
    const boxRef = useRef<HTMLDivElement>(null);
    const {x, y, direction} = useScroll(boxRef);

    const box = boxRef.current;
    const maxY = box ? box.scrollHeight - box.clientHeight : 0;
    const Icon = direction ? ICONS[direction] : null;

    return (
        <Stage>
            <StageHeader title="Reading progress" hint="Scroll inside the box, both down and sideways."/>
            <div className="space-y-4">
                <Meter value={y} max={maxY} label="Read"/>
                <div ref={boxRef} className="h-56 overflow-auto rounded-xl border border-line bg-paper/80">
                    <div className="w-[160%] space-y-4 p-5 text-sm leading-relaxed text-ink-2">
                        {Array.from({length: 12}, (_, i) => (
                            <p key={i}>
                                <span className="font-mono text-ink-3">{String(i + 1).padStart(2, '0')}</span>{' '}
                                Section {i + 1}. This box is wider and taller than its frame, so it scrolls in both
                                directions. The hook reads scrollLeft and scrollTop from the ref and reports which way
                                the last scroll moved.
                            </p>
                        ))}
                    </div>
                </div>
                <ReadoutGrid>
                    <Readout label="x" value={`${Math.round(x)}px`}/>
                    <Readout label="y" value={`${Math.round(y)}px`}/>
                    <Readout
                        label="direction"
                        value={<span className="inline-flex items-center gap-1.5">{Icon && <Icon size={16}/>}{direction ?? 'null'}</span>}
                        tone="accent"
                    />
                </ReadoutGrid>
            </div>
        </Stage>
    );
}
