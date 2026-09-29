'use client'

import {Fragment, useEffect, useRef, useState, type KeyboardEvent} from 'react';
import {useHotkeys} from '@zenuilabs/react-hooks';
import {Button, Input, Kbd, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const BINDINGS = [
    {keys: 'mod+k', action: 'Open command palette'},
    {keys: 'shift+/', action: 'Show shortcuts'},
    {keys: 'alt+n', action: 'New note'},
    {keys: 'g h', action: 'Go to home'},
    {keys: 'g s', action: 'Go to settings'},
];

function keyLabel(token: string, apple: boolean) {
    if (token === 'mod') return apple ? 'Cmd' : 'Ctrl';
    if (token === 'alt') return apple ? 'Option' : 'Alt';
    if (token === 'shift') return 'Shift';
    return token.length === 1 ? token.toUpperCase() : token;
}

function eventLabel(event: KeyboardEvent, apple: boolean) {
    if (event.key === 'Meta') return apple ? 'Cmd' : 'Meta';
    if (event.key === 'Control') return 'Ctrl';
    if (event.key === 'Alt') return apple ? 'Option' : 'Alt';
    if (event.key === ' ') return 'Space';
    return event.key.length === 1 ? event.key.toUpperCase() : event.key;
}

function Combo({keys, apple}: { keys: string; apple: boolean }) {
    return (
        <span className="inline-flex flex-wrap items-center gap-1">
            {keys.split(' ').map((step, i) => (
                <Fragment key={i}>
                    {i > 0 && <span className="px-0.5 font-mono text-[11px] text-ink-3">then</span>}
                    {step.split('+').map((token) => <Kbd key={token}>{keyLabel(token, apple)}</Kbd>)}
                </Fragment>
            ))}
        </span>
    );
}

export default function UseHotkeysDemo() {
    const zoneRef = useRef<HTMLDivElement>(null);
    const [apple, setApple] = useState(false);
    const [enableOnFormFields, setEnableOnFormFields] = useState(false);
    const [held, setHeld] = useState<string[]>([]);
    const [lit, setLit] = useState<string | null>(null);
    const [fired, setFired] = useState(0);
    const [entries, setEntries] = useState<string[]>([]);
    const litTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
        setApple(/Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent));
        return () => clearTimeout(litTimer.current);
    }, []);

    const {sequence} = useHotkeys(BINDINGS.map((b) => b.keys), (event, {hotkey}) => {
        // The docs site has its own Cmd+K menu on window; keep this press inside the demo.
        event.stopPropagation();
        const binding = BINDINGS.find((b) => b.keys === hotkey);
        setFired((count) => count + 1);
        setLit(hotkey);
        clearTimeout(litTimer.current);
        litTimer.current = setTimeout(() => setLit(null), 700);
        setEntries((previous) => [`${hotkey}: ${binding?.action}`, ...previous].slice(0, 12));
    }, {target: zoneRef, enableOnFormFields});

    return (
        <Stage>
            <StageHeader
                title="Keyboard shortcuts"
                hint="Click the workspace to focus it, then try the shortcuts. Sequences need the second key within one second."
            />
            <div className="space-y-4">
                <div
                    ref={zoneRef}
                    tabIndex={0}
                    onKeyDown={(event) => {
                        const label = eventLabel(event, apple);
                        setHeld((keys) => (keys.includes(label) ? keys : [...keys, label]));
                    }}
                    onKeyUp={(event) => {
                        const label = eventLabel(event, apple);
                        // Releasing Cmd on macOS swallows the other keyups, so clear everything with it.
                        setHeld((keys) => (label === 'Cmd' ? [] : keys.filter((key) => key !== label)));
                    }}
                    onBlur={() => setHeld([])}
                    className="space-y-3 rounded-xl border border-line bg-paper/60 p-4 outline-none focus:border-accent"
                >
                    <div className="flex min-h-10 flex-wrap items-center gap-1.5">
                        <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">Held</span>
                        {held.length === 0
                            ? <span className="text-sm text-ink-3">Focus here and press keys</span>
                            : held.map((key) => (
                                <span key={key} className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border-2 border-accent bg-accent-soft px-2 font-mono text-xs text-ink">
                                    {key}
                                </span>
                            ))}
                    </div>
                    <ul className="divide-y divide-line rounded-lg border border-line bg-panel">
                        {BINDINGS.map((binding) => {
                            const pending = sequence.length > 0 && binding.keys.startsWith(`${sequence.join(' ')} `);
                            return (
                                <li
                                    key={binding.keys}
                                    className={
                                        'flex items-center justify-between gap-3 px-3 py-2 text-sm transition-colors '
                                        + (lit === binding.keys ? 'bg-accent-soft text-ink' : pending ? 'bg-panel-2 text-ink' : 'text-ink-2')
                                    }
                                >
                                    <span>{binding.action}</span>
                                    <Combo keys={binding.keys} apple={apple}/>
                                </li>
                            );
                        })}
                    </ul>
                    <Input placeholder="Type here: shortcuts are ignored in form fields unless enabled"/>
                </div>
                <Row>
                    <Button
                        size="sm"
                        variant={enableOnFormFields ? 'primary' : 'secondary'}
                        onClick={() => setEnableOnFormFields((on) => !on)}
                    >
                        enableOnFormFields: {String(enableOnFormFields)}
                    </Button>
                </Row>
                <ReadoutGrid cols={4}>
                    <Readout
                        label="sequence"
                        value={sequence.length ? `${sequence.join(' ')} ...` : 'empty'}
                        tone={sequence.length ? 'signal' : 'default'}
                        live={sequence.length > 0}
                    />
                    <Readout label="Last hotkey" value={lit ?? entries[0]?.split(':')[0] ?? 'none'} tone="accent"/>
                    <Readout label="Fired" value={fired}/>
                    <Readout label="mod means" value={apple ? 'Cmd' : 'Ctrl'}/>
                </ReadoutGrid>
                <Log entries={entries} empty="No shortcuts fired yet."/>
                <Note>
                    Combos match the typed character first and fall back to the physical key, so shift+/ fires
                    whether the browser reports / or ?. The demo listens on the workspace through the target option.
                </Note>
            </div>
        </Stage>
    );
}
