'use client'

import {useCallback, useMemo, useState} from 'react';
import {useVirtualList, type VirtualListAlign} from '@zenuilabs/react-hooks';
import {Button, Field, Input, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const TOTAL = 100_000;
const GROUP = 50;
const ROW_HEIGHT = 32;
const HEADER_HEIGHT = 44;
const VIEWPORT = 320;
const OVERSCANS = [0, 4, 16];
const ALIGNS: VirtualListAlign[] = ['start', 'center', 'end'];
const STATUSES = ['paid', 'pending', 'refunded', 'shipped'];

interface Order {
    id: string;
    amount: string;
    status: string;
}

// Deterministic fake data, so the same row always shows the same order.
function makeOrder(index: number): Order {
    const hash = Math.imul(index + 1, 2654435761) >>> 0;
    return {
        id: `ZX-${hash.toString(36).toUpperCase().slice(0, 5).padStart(5, '0')}`,
        amount: ((hash % 90000) / 100 + 5).toFixed(2),
        status: STATUSES[hash % STATUSES.length],
    };
}

export default function UseVirtualListDemo() {
    const orders = useMemo(() => Array.from({length: TOTAL}, (_, index) => makeOrder(index)), []);
    const [overscan, setOverscan] = useState(4);
    const [target, setTarget] = useState('50000');
    const [highlight, setHighlight] = useState<number | null>(null);

    // Every 50th row is a taller batch header. Memoized so offsets are computed once.
    const itemHeight = useCallback((index: number) => (index % GROUP === 0 ? HEADER_HEIGHT : ROW_HEIGHT), []);

    const {containerProps, innerProps, virtualItems, totalHeight, scrollToIndex} = useVirtualList(orders, {
        itemHeight,
        overscan,
        containerHeight: VIEWPORT,
    });

    const jump = (align: VirtualListAlign) => {
        const index = Math.min(TOTAL, Math.max(1, Number(target) || 1)) - 1;
        setHighlight(index);
        scrollToIndex(index, align);
    };

    const random = () => {
        const index = Math.floor(Math.random() * TOTAL);
        setTarget(String(index + 1));
        setHighlight(index);
        scrollToIndex(index, 'center');
    };

    const first = virtualItems[0]?.index ?? 0;
    const last = virtualItems[virtualItems.length - 1]?.index ?? 0;

    return (
        <Stage>
            <StageHeader
                title="Scroll 100,000 rows"
                hint="Only the rows in view, plus a few extra, are in the DOM. Scroll fast, or jump anywhere."
            />
            <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                    <Field label="Row number">
                        <Input
                            type="number"
                            min={1}
                            max={TOTAL}
                            value={target}
                            onChange={(event) => setTarget(event.target.value)}
                            onKeyDown={(event) => event.key === 'Enter' && jump('center')}
                        />
                    </Field>
                    <Row>
                        {ALIGNS.map((align) => (
                            <Button key={align} size="sm" variant={align === 'center' ? 'primary' : 'secondary'} onClick={() => jump(align)}>
                                {align}
                            </Button>
                        ))}
                        <Button size="sm" variant="ghost" onClick={random}>Random</Button>
                    </Row>
                </div>
                <div
                    {...containerProps}
                    className="rounded-xl border border-line bg-paper/80 font-mono text-xs"
                >
                    <div {...innerProps}>
                        {virtualItems.map(({index, item, start, size}) => {
                            const isHeader = index % GROUP === 0;
                            return (
                                <div
                                    key={index}
                                    className={
                                        'absolute inset-x-0 top-0 flex items-center gap-3 border-b border-line px-3 '
                                        + (index === highlight ? 'bg-accent-soft text-ink' : isHeader ? 'bg-panel-2 text-ink' : 'text-ink-2')
                                    }
                                    style={{height: size, transform: `translateY(${start}px)`}}
                                >
                                    {isHeader ? (
                                        <span className="font-display text-sm font-semibold">
                                            Batch {index / GROUP + 1} <span className="font-mono text-xs font-normal text-ink-3">rows {index + 1} to {index + GROUP}</span>
                                        </span>
                                    ) : (
                                        <>
                                            <span className="w-16 tabular-nums text-ink-3">{(index + 1).toLocaleString('en-US')}</span>
                                            <span className="w-20 shrink-0 whitespace-nowrap">{item.id}</span>
                                            <span className="w-20 text-right tabular-nums">{item.amount}</span>
                                            <span className="text-ink-3">{item.status}</span>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <Row>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">overscan</span>
                    {OVERSCANS.map((value) => (
                        <Button key={value} size="sm" variant={value === overscan ? 'primary' : 'secondary'} onClick={() => setOverscan(value)}>
                            {value}
                        </Button>
                    ))}
                </Row>
                <ReadoutGrid cols={4}>
                    <Readout label="Rows in the DOM" value={virtualItems.length} tone="accent"/>
                    <Readout label="Total" value={TOTAL.toLocaleString('en-US')}/>
                    <Readout label="Window" value={`${first + 1} to ${last + 1}`}/>
                    <Readout label="totalHeight" value={`${totalHeight.toLocaleString('en-US')} px`}/>
                </ReadoutGrid>
                <Note>
                    Row heights mix 32px rows and 44px headers. Offsets are prefix sums computed once, and each scroll
                    runs a binary search. Scrolling inside the same range does not re-render.
                </Note>
            </div>
        </Stage>
    );
}
