'use client'

import React, {useEffect, useState} from 'react';
import {useReducedMotion} from '@zenuilabs/react-hooks';
import {Button, Note, Readout, ReadoutGrid, Stage, StageHeader} from '@/components/demo';

const CARDS = ['Inbox', 'Drafts', 'Sent', 'Archive'];

export default function UseReducedMotionDemo() {
    const reduced = useReducedMotion();
    const [active, setActive] = useState(0);
    const [auto, setAuto] = useState(true);

    useEffect(() => {
        if (!auto) return;
        const id = setInterval(() => setActive((i) => (i + 1) % CARDS.length), 1400);
        return () => clearInterval(id);
    }, [auto]);

    return (
        <Stage>
            <StageHeader
                title="Motion preference"
                hint="The highlight slides between tabs. Turn on Reduce motion in your OS accessibility settings and it jumps instead, with no reload."
            />

            <div className="relative grid grid-cols-4 rounded-xl border border-line bg-paper p-1">
                <div
                    aria-hidden
                    className="absolute inset-y-1 left-1 rounded-lg bg-accent"
                    style={{
                        width: `calc((100% - 0.5rem) / ${CARDS.length})`,
                        transform: `translateX(${active * 100}%)`,
                        transition: reduced ? 'none' : 'transform 450ms cubic-bezier(0.3, 1.4, 0.5, 1)',
                    }}
                />
                {CARDS.map((card, i) => (
                    <button
                        key={card}
                        type="button"
                        onClick={() => {
                            setAuto(false);
                            setActive(i);
                        }}
                        className={`relative z-10 h-10 rounded-lg text-sm transition-colors ${i === active ? 'text-accent-ink' : 'text-ink-2'}`}
                    >
                        {card}
                    </button>
                ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setAuto((a) => !a)}>
                    {auto ? 'Stop auto play' : 'Auto play'}
                </Button>
            </div>

            <ReadoutGrid cols={2} className="mt-5">
                <Readout label="reduced" value={String(reduced)} tone={reduced ? 'signal' : 'default'}/>
                <Readout label="transition used" value={reduced ? 'none' : 'transform 450ms'}/>
            </ReadoutGrid>
            <Note className="mt-3">
                macOS: System Settings, Accessibility, Display, Reduce motion. Windows: Settings, Accessibility,
                Visual effects, Animation effects. In Chrome DevTools you can also emulate it from the Rendering panel.
            </Note>
        </Stage>
    );
}
