'use client'

import {useEffect, useRef, useState} from 'react';
import {Archive, Check, RotateCcw} from 'lucide-react';
import {useSwipe, type SwipeEvent} from '@zenuilabs/react-hooks';
import {Button, Log, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

interface Message {
    id: number;
    from: string;
    subject: string;
}

const INBOX: Message[] = [
    {id: 1, from: 'Priya', subject: 'Draft of the Q3 roadmap'},
    {id: 2, from: 'Build bot', subject: 'Nightly build passed'},
    {id: 3, from: 'Marco', subject: 'Lunch on Thursday?'},
    {id: 4, from: 'Billing', subject: 'Your invoice for September'},
    {id: 5, from: 'Ana', subject: 'Notes from the design review'},
];

const THRESHOLD = 80;

// Starts where the finger let go, then flies off on the next frame so the transition has a start point.
function LeavingCard({message, to, dx}: { message: Message; to: 'left' | 'right'; dx: number }) {
    const [flying, setFlying] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setFlying(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    const x = flying ? (to === 'left' ? -420 : 420) : dx;
    return (
        <div
            className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end rounded-xl border border-line-strong bg-panel p-4 transition-[transform,opacity] duration-200 ease-out"
            style={{transform: `translateX(${x}px) rotate(${x / 18}deg)`, opacity: flying ? 0 : 1}}
        >
            <p className="font-display text-lg font-semibold text-ink">{message.subject}</p>
        </div>
    );
}

export default function UseSwipeDemo() {
    const [deck, setDeck] = useState(INBOX);
    const [leaving, setLeaving] = useState<{ message: Message; to: 'left' | 'right'; dx: number } | null>(null);
    const [lastSwipe, setLastSwipe] = useState<SwipeEvent | null>(null);
    const [entries, setEntries] = useState<string[]>([]);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    const dismiss = (swipe: SwipeEvent) => {
        if (swipe.direction !== 'left' && swipe.direction !== 'right') return;
        const [top, ...rest] = deck;
        if (!top) return;
        setLastSwipe(swipe);
        setDeck(rest);
        setLeaving({message: top, to: swipe.direction, dx: swipe.deltaX});
        setEntries((previous) => [
            `${swipe.direction === 'left' ? 'Archived' : 'Kept'} "${top.subject}" (${swipe.distance.toFixed(0)}px, ${swipe.velocity.toFixed(2)} px/ms)`,
            ...previous,
        ].slice(0, 10));
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setLeaving(null), 260);
    };

    // The ref moves to whichever card is on top; the callback ref re-binds on every swap.
    const {ref, direction, isSwiping, deltaX, deltaY} = useSwipe<HTMLDivElement>({
        axis: 'x',
        threshold: THRESHOLD,
        onSwipe: dismiss,
    });

    const lean = Math.max(-1, Math.min(1, deltaX / THRESHOLD));

    return (
        <Stage>
            <StageHeader
                title="Swipe through the inbox"
                hint="Drag the top card left to archive or right to keep. Let go early and it springs back. A quick flick also counts."
                live={isSwiping}
            />
            <div className="space-y-4">
                <div className="relative mx-auto h-48 max-w-sm">
                    {deck.length === 0 && !leaving && (
                        <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed border-line-strong text-sm text-ink-3">
                            Inbox zero
                        </div>
                    )}
                    {deck.slice(0, 3).reverse().map((message) => {
                        const depth = deck.indexOf(message);
                        const isTop = depth === 0;
                        return (
                            <div
                                key={message.id}
                                ref={isTop ? ref : undefined}
                                className={
                                    'absolute inset-0 flex select-none flex-col justify-between rounded-xl border border-line-strong bg-panel p-4 '
                                    + (isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none')
                                }
                                style={{
                                    transform: isTop
                                        ? `translate(${deltaX}px, ${deltaY}px) rotate(${deltaX / 18}deg)`
                                        : `translateY(${depth * 10}px) scale(${1 - depth * 0.04})`,
                                    transition: isTop && isSwiping ? 'none' : 'transform 200ms ease-out',
                                    zIndex: 10 - depth,
                                }}
                            >
                                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                                    <span>{message.from}</span>
                                    <span>{INBOX.findIndex((m) => m.id === message.id) + 1} of {INBOX.length}</span>
                                </div>
                                <p className="font-display text-lg font-semibold text-ink">{message.subject}</p>
                                {isTop && (
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="inline-flex items-center gap-1 text-danger" style={{opacity: Math.max(0.25, -lean)}}>
                                            <Archive className="size-3.5"/> Archive
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-ok" style={{opacity: Math.max(0.25, lean)}}>
                                            Keep <Check className="size-3.5"/>
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {leaving && <LeavingCard key={leaving.message.id} {...leaving}/>}
                </div>
                <Row className="justify-center">
                    <Button variant="secondary" onClick={() => setDeck(INBOX)} disabled={deck.length === INBOX.length}>
                        <RotateCcw className="size-4"/> Refill inbox
                    </Button>
                </Row>
                <ReadoutGrid cols={4}>
                    <Readout label="deltaX" value={deltaX.toFixed(0)} live={isSwiping}/>
                    <Readout label="isSwiping" value={String(isSwiping)}/>
                    <Readout label="direction" value={direction ?? 'null'} tone="accent"/>
                    <Readout label="Last velocity" value={lastSwipe ? `${lastSwipe.velocity.toFixed(2)} px/ms` : 'none'}/>
                </ReadoutGrid>
                <Log entries={entries} empty="Swipe a card to see the gesture details."/>
            </div>
        </Stage>
    );
}
