'use client'

import {useState} from 'react';
import {usePrevious} from '@zenuilabs/react-hooks';
import {Button, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const START = 102.4;

export default function UsePreviousDemo() {
    const [price, setPrice] = useState(START);
    const previous = usePrevious(price);

    const tick = () => {
        const change = Math.round((Math.random() - 0.5) * 60) / 10;
        setPrice(p => Math.max(1, Math.round((p + change) * 10) / 10));
    };

    const delta = previous === undefined ? 0 : Math.round((price - previous) * 10) / 10;
    const direction = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';

    return (
        <Stage>
            <StageHeader title="Price ticker" hint="Each tick sets a new price. The hook returns the price from the render before."/>
            <div className="space-y-5">
                <div className="flex items-baseline gap-3">
                    <span className="font-display text-5xl font-semibold tabular-nums text-ink">{price.toFixed(1)}</span>
                    <span className={delta > 0 ? 'font-mono text-ok' : delta < 0 ? 'font-mono text-danger' : 'font-mono text-ink-3'}>
                        {delta > 0 ? '+' : ''}{delta.toFixed(1)}
                    </span>
                </div>
                <Row>
                    <Button onClick={tick}>Next tick</Button>
                    <Button variant="ghost" onClick={() => setPrice(START)}>Reset price</Button>
                </Row>
                <ReadoutGrid>
                    <Readout label="value" value={price.toFixed(1)}/>
                    <Readout label="previous" value={previous === undefined ? 'undefined' : previous.toFixed(1)} tone="accent"/>
                    <Readout
                        label="Direction"
                        value={direction}
                        tone={direction === 'up' ? 'ok' : direction === 'down' ? 'danger' : 'default'}
                    />
                </ReadoutGrid>
            </div>
        </Stage>
    );
}
