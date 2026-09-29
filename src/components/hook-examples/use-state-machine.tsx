'use client'

import {useRef, useState} from 'react';
import {useStateMachine} from '@zenuilabs/react-hooks';
import {Button, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';
import {cn} from '@/lib/cn';

const MAX_RETRIES = 2;

type Node = { x: number; y: number };
const NODES: Record<'idle' | 'loading' | 'success' | 'failure', Node> = {
    idle: {x: 70, y: 110},
    loading: {x: 260, y: 110},
    success: {x: 450, y: 45},
    failure: {x: 450, y: 175},
};

const EDGES: { from: keyof typeof NODES; to: keyof typeof NODES; label: string; path: string; lx: number; ly: number }[] = [
    {from: 'idle', to: 'loading', label: 'FETCH', path: 'M 125 102 L 205 102', lx: 165, ly: 94},
    {from: 'loading', to: 'idle', label: 'CANCEL', path: 'M 205 120 L 125 120', lx: 165, ly: 136},
    {from: 'loading', to: 'success', label: 'RESOLVE', path: 'M 315 98 L 395 55', lx: 345, ly: 64},
    {from: 'loading', to: 'failure', label: 'REJECT', path: 'M 315 122 L 395 165', lx: 345, ly: 160},
    {from: 'failure', to: 'loading', label: 'RETRY', path: 'M 395 185 C 330 210 285 170 270 132', lx: 318, ly: 207},
    {from: 'success', to: 'idle', label: 'RESET', path: 'M 395 38 C 250 0 120 20 75 88', lx: 230, ly: 16},
];

export default function UseStateMachineDemo() {
    const [failRate, setFailRate] = useState(0.5);
    const retries = useRef(0);
    const [log, setLog] = useState<string[]>([]);
    const note = (line: string) => setLog((current) => [line, ...current].slice(0, 30));

    const machine = useStateMachine({
        initial: 'idle',
        states: {
            idle: {
                on: {FETCH: 'loading'},
                entry: () => {
                    retries.current = 0;
                },
            },
            loading: {
                on: {RESOLVE: 'success', REJECT: 'failure', CANCEL: 'idle'},
                // Simulated request. The cleanup cancels it when the machine leaves `loading`.
                entry: ({send}) => {
                    note('entry(loading): request started');
                    const timer = setTimeout(() => send(Math.random() < failRate ? 'REJECT' : 'RESOLVE'), 1400);
                    return () => {
                        clearTimeout(timer);
                        note('cleanup(loading): timer cleared');
                    };
                },
            },
            success: {on: {RESET: 'idle'}},
            failure: {
                on: {
                    RETRY: {target: 'loading', guard: () => retries.current < MAX_RETRIES},
                    RESET: 'idle',
                },
                exit: ({event}) => {
                    if (event === 'RETRY') retries.current += 1;
                },
            },
        },
    });

    const {state, send, can, matches, history, event, reset} = machine;
    const events = ['FETCH', 'CANCEL', 'RETRY', 'RESET'] as const;

    return (
        <Stage>
            <StageHeader
                title="Request lifecycle"
                hint="Send events to move between states. Buttons are disabled when can(event) is false. Loading settles on its own after 1.4 seconds."
            />

            <div className="mb-5 overflow-x-auto rounded-xl border border-line bg-paper/70 p-2">
                <svg viewBox="0 0 520 225" className="mx-auto h-auto w-full min-w-[440px] max-w-[620px]" role="img"
                     aria-label={`State diagram, current state ${state}`}>
                    <defs>
                        <marker id="sm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-ink-3"/>
                        </marker>
                    </defs>
                    {EDGES.map((edge) => {
                        const active = state === edge.from;
                        return (
                            <g key={edge.label + edge.from}>
                                <path d={edge.path} fill="none" markerEnd="url(#sm-arrow)"
                                      className={cn('transition-colors', active ? 'stroke-accent' : 'stroke-line-strong')}
                                      strokeWidth={active ? 2 : 1.25}/>
                                <text x={edge.lx} y={edge.ly} textAnchor="middle"
                                      className={cn('font-mono text-[10px]', active ? 'fill-ink' : 'fill-ink-3')}>
                                    {edge.label}
                                </text>
                            </g>
                        );
                    })}
                    {(Object.keys(NODES) as (keyof typeof NODES)[]).map((name) => {
                        const node = NODES[name];
                        const active = state === name;
                        return (
                            <g key={name}>
                                <rect x={node.x - 55} y={node.y - 20} width={110} height={40} rx={10}
                                      className={cn('transition-colors', active ? 'fill-accent stroke-accent' : 'fill-panel stroke-line-strong')}
                                      strokeWidth={1.5}/>
                                <text x={node.x} y={node.y + 4} textAnchor="middle"
                                      className={cn('font-mono text-[13px]', active ? 'fill-accent-ink' : 'fill-ink-2')}>
                                    {name}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <Row className="mb-3">
                {events.map((name) => (
                    <Button key={name} variant={name === 'FETCH' ? 'primary' : 'secondary'} size="sm"
                            disabled={!can(name)} onClick={() => send(name)}>
                        {name}
                    </Button>
                ))}
                <Button size="sm" variant="ghost" onClick={reset}>reset()</Button>
            </Row>
            <Row className="mb-4">
                <label className="flex items-center gap-2 font-mono text-xs text-ink-2">
                    Failure rate
                    <input type="range" min={0} max={1} step={0.1} value={failRate}
                           onChange={(e) => setFailRate(Number(e.target.value))} className="accent-accent"/>
                    <span className="w-8 tabular-nums">{Math.round(failRate * 100)}%</span>
                </label>
            </Row>

            <div className="grid gap-3 md:grid-cols-2">
                <Log entries={history.slice().reverse().map((t) => `${t.from} --${t.event}--> ${t.to}`)}
                     empty="No transitions yet. Send FETCH."/>
                <Log entries={log} empty="Entry and cleanup effects show up here."/>
            </div>
            <Note className="mt-2">
                RETRY has a guard: it allows {MAX_RETRIES} retries per request, then stays disabled until RESET.
            </Note>

            <ReadoutGrid cols={4} className="mt-6">
                <Readout label="state" value={state} tone="signal"/>
                <Readout label="event" value={event ?? 'null'}/>
                <Readout label="can('RETRY')" value={String(can('RETRY'))} tone={can('RETRY') ? 'accent' : 'default'}/>
                <Readout label="matches(success, failure)" value={String(matches('success', 'failure'))}/>
            </ReadoutGrid>
        </Stage>
    );
}
