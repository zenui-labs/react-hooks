'use client'

import {useEffect, useRef, useState} from 'react';
import {useDebounce} from '@zenuilabs/react-hooks';
import {Button, Field, Input, Led, Log, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const DELAYS = [200, 500, 1000];

export default function UseDebounceDemo() {
    const [query, setQuery] = useState('');
    const [delay, setDelay] = useState(500);
    const debouncedQuery = useDebounce(query, delay);
    const [keystrokes, setKeystrokes] = useState(0);
    const [searches, setSearches] = useState<string[]>([]);
    const first = useRef(true);

    // Stands in for an API call. It only runs when the debounced value settles.
    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        setSearches(prev => [`search("${debouncedQuery}")`, ...prev].slice(0, 20));
    }, [debouncedQuery]);

    const waiting = query !== debouncedQuery;

    return (
        <Stage>
            <StageHeader title="Search as you type" hint="Type quickly. The search runs once you pause for the delay."/>
            <div className="space-y-4">
                <Field label="Search">
                    <Input
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value);
                            setKeystrokes(k => k + 1);
                        }}
                        placeholder="Try typing a city name"
                    />
                </Field>
                <Row>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">Delay</span>
                    {DELAYS.map(ms => (
                        <Button key={ms} size="sm" variant={ms === delay ? 'primary' : 'secondary'} onClick={() => setDelay(ms)}>
                            {ms} ms
                        </Button>
                    ))}
                    <Led on={waiting} label={waiting ? 'Waiting' : 'Settled'}/>
                </Row>
                <ReadoutGrid cols={4}>
                    <Readout label="value" value={query || '(empty)'}/>
                    <Readout label="debounced" value={debouncedQuery || '(empty)'} tone="accent"/>
                    <Readout label="Keystrokes" value={keystrokes}/>
                    <Readout label="Searches run" value={searches.length}/>
                </ReadoutGrid>
                <Log entries={searches} empty="No searches yet."/>
            </div>
        </Stage>
    );
}
