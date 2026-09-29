'use client'

import {useState} from 'react';
import {useMedia} from '@zenuilabs/react-hooks';
import {Field, Input, Led, Note, Stage, StageHeader} from '@/components/demo';

const PRESETS = [
    '(min-width: 768px)',
    '(min-width: 1280px)',
    '(prefers-color-scheme: dark)',
    '(prefers-reduced-motion: reduce)',
    '(hover: hover) and (pointer: fine)',
    '(orientation: portrait)',
];

function QueryRow({query}: { query: string }) {
    const {matches} = useMedia(query);
    return (
        <li className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper/70 px-3.5 py-2.5">
            <code className="min-w-0 truncate font-mono text-sm text-ink">{query}</code>
            <Led on={matches} label={matches ? 'true' : 'false'}/>
        </li>
    );
}

export default function UseMediaDemo() {
    const [custom, setCustom] = useState('(max-width: 600px)');

    return (
        <Stage>
            <StageHeader
                title="Resize the window"
                hint="Each row is one useMedia call. Resize the browser, switch the system theme or rotate your phone and the matches update."
            />
            <div className="space-y-4">
                <ul className="space-y-2">
                    {PRESETS.map((query) => <QueryRow key={query} query={query}/>)}
                </ul>
                <Field label="Try your own query">
                    <Input value={custom} onChange={(e) => setCustom(e.target.value)} className="font-mono"/>
                </Field>
                {custom.trim() && <ul><QueryRow query={custom.trim()}/></ul>}
                <Note>matches is false on the server and on the first render, then syncs before the browser paints.</Note>
            </div>
        </Stage>
    );
}
