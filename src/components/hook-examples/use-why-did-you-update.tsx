'use client'

import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useWhyDidYouUpdate} from '@zenuilabs/react-hooks';
import {Button, Field, Input, Note, Row, Stage, StageHeader} from '@/components/demo';
import {cn} from '@/lib/cn';

type CardProps = {
    title: string;
    count: number;
    style: { fontWeight: number };
    onSelect: () => void;
};

function show(value: unknown) {
    if (typeof value === 'function') return 'fn()';
    if (typeof value === 'string') return `"${value}"`;
    return JSON.stringify(value);
}

const Card = memo(function Card(props: CardProps) {
    const changes = useWhyDidYouUpdate('Card', props);
    const rows = Object.entries(changes);

    // Commit counter written to the DOM, skipping the Strict Mode replay of the mount effect.
    const renders = useRef(0);
    const el = useRef<HTMLSpanElement | null>(null);
    const last = useRef<object | null>(null);
    const token = changes;
    useEffect(() => {
        if (last.current === token) return;
        last.current = token;
        renders.current += 1;
        if (el.current) el.current.textContent = String(renders.current);
    });

    return (
        <div className="rounded-xl border border-line bg-paper/70 p-4">
            <div className="flex items-center justify-between gap-3">
                <button type="button" onClick={props.onSelect} className="text-left text-ink" style={props.style}>
                    {props.title} <span className="font-mono text-ink-2">x{props.count}</span>
                </button>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                    Card renders <span ref={el} className="text-ink"/>
                </span>
            </div>

            <table className="mt-4 w-full table-fixed border-collapse font-mono text-xs">
                <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.08em] text-ink-3">
                    <th className="w-1/5 pb-2 font-normal">prop</th>
                    <th className="w-1/4 pb-2 font-normal">from</th>
                    <th className="w-1/4 pb-2 font-normal">to</th>
                    <th className="pb-2 font-normal">why</th>
                </tr>
                </thead>
                <tbody>
                {rows.length === 0 ? (
                    <tr>
                        <td colSpan={4} className="border-t border-line py-2 text-ink-3">
                            No prop changed in this render.
                        </td>
                    </tr>
                ) : (
                    rows.map(([key, {from, to}]) => {
                        const sameShape = show(from) === show(to);
                        return (
                            <tr key={key} className="animate-flash border-t border-line">
                                <td className="py-2 text-ink">{key}</td>
                                <td className="truncate py-2 text-ink-2">{show(from)}</td>
                                <td className="truncate py-2 text-ink">{show(to)}</td>
                                <td className={cn('py-2', sameShape ? 'text-danger' : 'text-ok')}>
                                    {sameShape ? 'new reference, same value' : 'value changed'}
                                </td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
});

export default function UseWhyDidYouUpdateDemo() {
    const [, setTick] = useState(0);
    const [title, setTitle] = useState('Quarterly report');
    const [count, setCount] = useState(1);
    const [stable, setStable] = useState(false);

    const memoStyle = useMemo(() => ({fontWeight: 600}), []);
    const memoSelect = useCallback(() => undefined, []);
    const style = stable ? memoStyle : {fontWeight: 600};
    const onSelect = stable ? memoSelect : () => undefined;

    return (
        <Stage>
            <StageHeader
                title="Why did Card re-render"
                hint="Card is wrapped in memo. Re-render the parent: the inline style and callback are new every time, so memo cannot skip. Turn on stable props and it can."
            />

            <div className="grid gap-3 md:grid-cols-2">
                <Field label="title">
                    <Input value={title} onChange={(e) => setTitle(e.target.value)}/>
                </Field>
                <label className="flex items-end gap-2 pb-2.5 text-sm text-ink-2">
                    <input
                        type="checkbox"
                        checked={stable}
                        onChange={(e) => setStable(e.target.checked)}
                        className="size-4 accent-accent"
                    />
                    Stable props (useMemo and useCallback)
                </label>
            </div>

            <Row className="mt-4">
                <Button onClick={() => setTick((t) => t + 1)}>Re-render parent</Button>
                <Button variant="secondary" onClick={() => setCount((c) => c + 1)}>count + 1</Button>
            </Row>

            <div className="mt-5">
                <Card title={title} count={count} style={style} onSelect={onSelect}/>
            </div>
            <Note className="mt-3">
                The table is the object the hook returns. The same changes are logged to the browser console under
                [why-did-you-update].
            </Note>
        </Stage>
    );
}
