'use client'

import React, {useState} from 'react';
import {useTimeAgo} from '@zenuilabs/react-hooks';
import {Button, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const LOCALES = [
    {code: 'en', label: 'English'},
    {code: 'fr', label: 'Français'},
    {code: 'de', label: 'Deutsch'},
    {code: 'ja', label: '日本語'},
    {code: 'es', label: 'Español'},
];

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

type Entry = { id: number; label: string; at: number };

function TimeRow({entry, locale}: { entry: Entry; locale: string }) {
    const {text, value, unit, isFuture} = useTimeAgo(entry.at, {locale});
    return (
        <li className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-2.5 sm:grid-cols-[1fr_12rem_7rem]">
            <span className="min-w-0 truncate text-sm text-ink-2">{entry.label}</span>
            <span className={`text-right text-sm font-medium sm:text-left ${isFuture ? 'text-accent' : 'text-ink'}`}>{text}</span>
            <span className="hidden text-right font-mono text-xs tabular-nums text-ink-3 sm:block">{value} {unit}</span>
        </li>
    );
}

export default function UseTimeAgoDemo() {
    const [locale, setLocale] = useState('en');
    const [entries, setEntries] = useState<Entry[]>(() => {
        const now = Date.now();
        return [
            {id: 1, label: 'Deploy starts', at: now + 2 * MINUTE + 5 * SECOND},
            {id: 2, label: 'Page opened', at: now},
            {id: 3, label: 'Build finished', at: now - 45 * SECOND},
            {id: 4, label: 'Comment posted', at: now - 12 * MINUTE},
            {id: 5, label: 'Issue opened', at: now - 3 * HOUR},
            {id: 6, label: 'Branch created', at: now - DAY - HOUR},
            {id: 7, label: 'Last release', at: now - 38 * DAY},
            {id: 8, label: 'Conference talk', at: now + 3 * DAY},
        ];
    });

    const first = entries[0];
    const {text, value, unit} = useTimeAgo(first.at, {locale});

    const stamp = () =>
        setEntries((prev) => [{id: Date.now(), label: `Stamped at ${new Date().toLocaleTimeString()}`, at: Date.now()}, ...prev].slice(0, 12));

    return (
        <Stage>
            <StageHeader
                title="Activity feed"
                hint="Every row updates on its own, exactly when its text would change: every second for recent times, far less often for old ones. Add a stamp and watch it age."
            />

            <Row className="mb-4">
                <Button onClick={stamp}>Add a stamp now</Button>
                <span className="mx-1 h-6 w-px bg-line" aria-hidden/>
                {LOCALES.map((l) => (
                    <Button key={l.code} size="sm" variant={locale === l.code ? 'primary' : 'ghost'} onClick={() => setLocale(l.code)}>
                        {l.label}
                    </Button>
                ))}
            </Row>

            <ul className="divide-y divide-line rounded-xl border border-line bg-paper/80">
                {entries.map((entry) => <TimeRow key={entry.id} entry={entry} locale={locale}/>)}
            </ul>

            <ReadoutGrid cols={3} className="mt-4">
                <Readout label="text (first row)" value={text} tone="accent"/>
                <Readout label="value" value={value}/>
                <Readout label="unit" value={unit}/>
            </ReadoutGrid>

            <Note className="mt-4">
                The deploy row counts down in the future tense and flips to the past once it passes.
            </Note>
        </Stage>
    );
}
