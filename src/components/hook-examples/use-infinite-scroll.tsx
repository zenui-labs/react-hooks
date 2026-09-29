'use client'

import React, {useRef, useState} from 'react';
import {useInfiniteScroll} from '@zenuilabs/react-hooks';
import {Button, Note, Readout, ReadoutGrid, Row, Stage, StageHeader, Unsupported} from '@/components/demo';

const PAGE_SIZE = 12;
const TOTAL = 72;
const TOPICS = ['Release notes', 'Bug report', 'Design review', 'Incident', 'Question', 'Feature request'];

type Item = { id: number; title: string; topic: string };

function fetchPage(page: number, fail: boolean) {
    return new Promise<Item[]>((resolve, reject) => {
        setTimeout(() => {
            if (fail) return reject(new Error(`Page ${page + 1} failed to load`));
            const start = page * PAGE_SIZE;
            const count = Math.min(PAGE_SIZE, TOTAL - start);
            resolve(Array.from({length: count}, (_, i) => {
                const id = start + i + 1;
                return {id, title: `Thread ${id}`, topic: TOPICS[id % TOPICS.length]};
            }));
        }, 700);
    });
}

export default function UseInfiniteScrollDemo() {
    const [items, setItems] = useState<Item[]>([]);
    const [pages, setPages] = useState(0);
    const [failNext, setFailNext] = useState(false);
    const [calls, setCalls] = useState(0);
    const scroller = useRef<HTMLDivElement>(null);
    const hasMore = items.length < TOTAL;

    const loadMore = async () => {
        setCalls((n) => n + 1);
        const shouldFail = failNext;
        if (shouldFail) setFailNext(false);
        const next = await fetchPage(pages, shouldFail);
        setItems((prev) => [...prev, ...next]);
        setPages((p) => p + 1);
    };

    const {sentinelRef, isLoading, error, retry, isSupported} = useInfiniteScroll<HTMLLIElement>({
        loadMore,
        hasMore,
        root: scroller,
        rootMargin: '120px',
    });

    if (!isSupported) return <Unsupported api="IntersectionObserver"/>;

    const reset = () => {
        setItems([]);
        setPages(0);
        setCalls(0);
        scroller.current?.scrollTo({top: 0});
    };

    return (
        <Stage>
            <StageHeader
                title="Endless inbox"
                hint="Scroll the list. The next page starts loading 120px before the end, and fast scrolling never triggers a second request while one is running."
            />

            <Row className="mb-3">
                <Button variant={failNext ? 'danger' : 'secondary'} size="sm" onClick={() => setFailNext((on) => !on)}>
                    {failNext ? 'Next page will fail' : 'Fail next page'}
                </Button>
                <Button variant="ghost" size="sm" onClick={reset}>Reset</Button>
            </Row>

            <div ref={scroller} className="h-72 overflow-y-auto rounded-xl border border-line bg-paper/80">
                <ul className="divide-y divide-line">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
                            <span className="text-ink">{item.title}</span>
                            <span className="font-mono text-xs text-ink-3">{item.topic}</span>
                        </li>
                    ))}
                    <li ref={sentinelRef} className="px-4 py-4 text-center font-mono text-xs text-ink-3">
                        {error ? (
                            <span className="inline-flex items-center gap-3 text-danger">
                                {error instanceof Error ? error.message : 'Failed'}
                                <Button size="sm" variant="secondary" onClick={retry}>Retry</Button>
                            </span>
                        ) : isLoading ? (
                            'Loading page...'
                        ) : hasMore ? (
                            'Scroll for more'
                        ) : (
                            `All ${TOTAL} threads loaded`
                        )}
                    </li>
                </ul>
            </div>

            <ReadoutGrid cols={4} className="mt-4">
                <Readout label="isLoading" value={String(isLoading)} live={isLoading}/>
                <Readout label="items" value={`${items.length} / ${TOTAL}`} tone="accent"/>
                <Readout label="loadMore calls" value={calls}/>
                <Readout label="error" value={error ? 'set' : 'null'} tone={error ? 'danger' : 'default'}/>
            </ReadoutGrid>

            <Note className="mt-4">
                The first page loads on mount because the sentinel is already visible. After an error the hook stops
                until you call retry, so a broken endpoint is not hammered.
            </Note>
        </Stage>
    );
}
