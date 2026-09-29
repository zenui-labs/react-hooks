'use client'

import {useState} from 'react';
import {useTextareaAutosize} from '@zenuilabs/react-hooks';
import {Button, Meter, Note, Readout, ReadoutGrid, Row, Stage, StageHeader, Textarea} from '@/components/demo';

const MIN_OPTIONS = [1, 2, 3];
const MAX_OPTIONS = [4, 6, 10];

const PARAGRAPH = 'Thanks for the review. I split the migration into two steps so we can roll back the schema change on its own if the backfill takes longer than expected.';

export default function UseTextareaAutosizeDemo() {
    const [value, setValue] = useState('');
    const [minRows, setMinRows] = useState(2);
    const [maxRows, setMaxRows] = useState(6);
    const {ref, rows, height} = useTextareaAutosize({minRows, maxRows, value});

    const lines = value ? value.split('\n').length : 0;

    return (
        <Stage>
            <StageHeader
                title="A comment box that grows"
                hint="Type, paste or press Enter. The textarea grows to fit, stops at maxRows, then scrolls."
            />
            <div className="space-y-4">
                <Textarea
                    ref={ref}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="Leave a comment"
                    className="resize-none leading-6 transition-[height] duration-100"
                />
                <Row>
                    <Button onClick={() => setValue((current) => (current ? `${current}\n\n${PARAGRAPH}` : PARAGRAPH))}>
                        Insert paragraph
                    </Button>
                    <Button variant="secondary" onClick={() => setValue('')} disabled={!value}>Clear</Button>
                </Row>
                <Row>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">minRows</span>
                    {MIN_OPTIONS.map((n) => (
                        <Button key={n} size="sm" variant={n === minRows ? 'primary' : 'secondary'} onClick={() => setMinRows(n)}>{n}</Button>
                    ))}
                    <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">maxRows</span>
                    {MAX_OPTIONS.map((n) => (
                        <Button key={n} size="sm" variant={n === maxRows ? 'primary' : 'secondary'} onClick={() => setMaxRows(n)}>{n}</Button>
                    ))}
                </Row>
                <Meter value={rows} max={maxRows} label={`rows ${rows} of ${maxRows}`}/>
                <ReadoutGrid cols={4}>
                    <Readout label="rows" value={rows} tone="accent"/>
                    <Readout label="height" value={`${Math.round(height)} px`}/>
                    <Readout label="Lines typed" value={lines}/>
                    <Readout label="At maxRows" value={rows >= maxRows ? 'yes' : 'no'} tone={rows >= maxRows ? 'signal' : 'default'}/>
                </ReadoutGrid>
                <Note>
                    Insert paragraph and Clear change the value from code, without an input event. Passing value lets the
                    hook resize for those too. Wrapped lines count, so rows can exceed the lines you typed.
                </Note>
            </div>
        </Stage>
    );
}
