'use client'

import {useEffect, useRef, useState} from 'react';
import {Minus, Plus} from 'lucide-react';
import {useMap} from '@zenuilabs/react-hooks';
import {Button, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const PRODUCTS = [
    {sku: 'tea', name: 'Green tea', price: 4.5},
    {sku: 'mug', name: 'Stoneware mug', price: 12},
    {sku: 'beans', name: 'Coffee beans', price: 16},
    {sku: 'filter', name: 'Paper filters', price: 3},
];

const price = (sku: string) => PRODUCTS.find((p) => p.sku === sku)?.price ?? 0;

export default function UseMapDemo() {
    const {map: cart, size, set, remove, clear, reset} = useMap<string, number>([['tea', 2]]);
    const [log, setLog] = useState<string[]>([]);
    const seen = useRef(new Set<ReadonlyMap<string, number>>());
    const [versions, setVersions] = useState(1);

    // Count distinct Map objects. Every real change produces a new Map.
    useEffect(() => {
        seen.current.add(cart);
        setVersions(seen.current.size);
    }, [cart]);

    const record = (entry: string) => setLog((current) => [entry, ...current].slice(0, 30));

    const change = (sku: string, delta: number) => {
        const next = (cart.get(sku) ?? 0) + delta;
        if (next <= 0) {
            remove(sku);
            record(`remove('${sku}')`);
        } else {
            set(sku, next);
            record(`set('${sku}', ${next})`);
        }
    };

    const total = Array.from(cart).reduce((sum, [sku, qty]) => sum + price(sku) * qty, 0);
    const units = Array.from(cart.values()).reduce((sum, qty) => sum + qty, 0);

    return (
        <Stage>
            <StageHeader title="Shopping cart" hint="Quantities live in a Map keyed by SKU. Dropping to zero removes the key."/>

            <div className="grid gap-4 md:grid-cols-2">
                <ul className="space-y-2">
                    {PRODUCTS.map((product) => {
                        const qty = cart.get(product.sku) ?? 0;
                        return (
                            <li key={product.sku}
                                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper/70 px-3 py-2">
                                <div className="min-w-0">
                                    <div className="text-sm text-ink">{product.name}</div>
                                    <div className="font-mono text-xs text-ink-3">${product.price.toFixed(2)}</div>
                                </div>
                                <Row className="flex-nowrap">
                                    <Button size="sm" variant="secondary" aria-label={`Remove one ${product.name}`}
                                            onClick={() => change(product.sku, -1)} disabled={qty === 0}>
                                        <Minus size={14}/>
                                    </Button>
                                    <span className="w-6 text-center font-mono tabular-nums text-ink">{qty}</span>
                                    <Button size="sm" aria-label={`Add one ${product.name}`} onClick={() => change(product.sku, 1)}>
                                        <Plus size={14}/>
                                    </Button>
                                </Row>
                            </li>
                        );
                    })}
                </ul>

                <div className="flex flex-col gap-3">
                    <div className="rounded-xl border border-line bg-paper/80 p-3 font-mono text-xs text-ink-2">
                        <div className="mb-1 text-ink-3">Map({size}) {'{'}</div>
                        {size === 0 && <div className="pl-4 text-ink-3">empty</div>}
                        {Array.from(cart).map(([sku, qty]) => (
                            <div key={sku} className="pl-4"><span className="text-accent">&apos;{sku}&apos;</span> =&gt; {qty}</div>
                        ))}
                        <div className="text-ink-3">{'}'}</div>
                    </div>
                    <Row>
                        <Button variant="secondary" size="sm" onClick={() => { clear(); record('clear()'); }}>Clear</Button>
                        <Button variant="ghost" size="sm" onClick={() => { reset(); record('reset()'); }}>Reset</Button>
                    </Row>
                    <Log entries={log} empty="Change a quantity to log the call."/>
                </div>
            </div>

            <ReadoutGrid cols={4} className="mt-6">
                <Readout label="size" value={size}/>
                <Readout label="units" value={units}/>
                <Readout label="total" value={`$${total.toFixed(2)}`} tone="accent"/>
                <Readout label="map versions" value={versions}/>
            </ReadoutGrid>
            <Note className="mt-3">
                Map versions counts new Map objects. Clearing an empty cart or removing a missing key keeps the same map,
                so nothing re-renders.
            </Note>
        </Stage>
    );
}
