'use client'

import React, {useEffect, useRef, useState} from 'react';
import {useDeepCompareEffect} from '@zenuilabs/react-hooks';
import {Button, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';
import {cn} from '@/lib/cn';

type Filters = { page: number; sort: 'price' | 'rating'; tags: string[] };

/**
 * Counts effect runs and writes them straight to the DOM. Using state here would
 * re-render the parent and retrigger the plain useEffect forever.
 * The render token skips the extra mount run React does in Strict Mode.
 */
function useRunCounter() {
    const el = useRef<HTMLSpanElement | null>(null);
    const count = useRef(0);
    const lastToken = useRef<object | null>(null);
    const flash = useRef<HTMLDivElement | null>(null);

    const record = (token: object) => {
        if (lastToken.current === token) return;
        lastToken.current = token;
        count.current += 1;
        if (el.current) el.current.textContent = String(count.current);
        const box = flash.current;
        if (box) {
            box.dataset.flash = 'false';
            void box.offsetWidth;
            box.dataset.flash = 'true';
        }
    };

    return {el, flash, record};
}

function Counter({title, code, counter}: { title: string; code: string; counter: ReturnType<typeof useRunCounter> }) {
    return (
        <div
            ref={counter.flash}
            className={cn(
                'rounded-xl border border-line bg-paper/70 p-4 transition-colors',
                'data-[flash=true]:animate-flash'
            )}
        >
            <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">{title}</div>
            <div className="mt-1 font-mono text-4xl tabular-nums text-ink">
                <span ref={counter.el}/>
            </div>
            <div className="mt-2 font-mono text-xs text-ink-2">{code}</div>
        </div>
    );
}

export default function UseDeepCompareEffectDemo() {
    const [renders, setRenders] = useState(0);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<Filters['sort']>('price');

    // A brand new object every render, the way most props arrive.
    const filters: Filters = {page, sort, tags: ['outdoor', 'sale']};
    const token = {};

    const plain = useRunCounter();
    const deep = useRunCounter();

    useEffect(() => {
        plain.record(token);
    }, [filters]);

    useDeepCompareEffect(() => {
        deep.record(token);
    }, [filters]);

    return (
        <Stage>
            <StageHeader
                title="Effect runs: reference vs value"
                hint="Both effects depend on the same inline filters object. Re-render with identical values and only the plain useEffect runs again."
            />

            <Row>
                <Button onClick={() => setRenders((r) => r + 1)}>Re-render (same values)</Button>
                <Button variant="secondary" onClick={() => setPage((p) => p + 1)}>Next page</Button>
                <Button variant="secondary" onClick={() => setSort((s) => (s === 'price' ? 'rating' : 'price'))}>
                    Sort by {sort === 'price' ? 'rating' : 'price'}
                </Button>
            </Row>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Counter title="useEffect runs" code="useEffect(fn, [filters])" counter={plain}/>
                <Counter title="useDeepCompareEffect runs" code="useDeepCompareEffect(fn, [filters])" counter={deep}/>
            </div>

            <ReadoutGrid cols={3} className="mt-5">
                <Readout label="same-value re-renders" value={renders}/>
                <Readout label="filters.page" value={filters.page}/>
                <Readout label="filters.sort" value={filters.sort}/>
            </ReadoutGrid>
            <Note className="mt-3">
                Deep comparison walks the dependency on every render, so keep dependencies small. It handles plain
                objects, arrays, Date, RegExp, Map, Set and NaN.
            </Note>
        </Stage>
    );
}
