'use client'

import {useEffect, useRef, useState} from 'react';
import {useLocation} from '@zenuilabs/react-hooks';
import {Button, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const TARGETS = ['?view=grid', '?view=list&sort=new', '#reviews'];

export default function UseLocationDemo() {
    const {pathname, search, hash} = useLocation();
    const [log, setLog] = useState<string[]>([]);
    const startUrl = useRef<string | null>(null);

    useEffect(() => {
        if (startUrl.current === null) startUrl.current = window.location.pathname + window.location.search + window.location.hash;
    }, []);

    useEffect(() => {
        if (!pathname) return;
        setLog((entries) => [`${pathname}${search}${hash}`, ...entries].slice(0, 8));
    }, [pathname, search, hash]);

    const push = (target: string) => {
        const url = target.startsWith('#') ? `${pathname}${search}${target}` : `${pathname}${target}`;
        window.history.pushState(null, '', url);
    };

    const reset = () => {
        if (startUrl.current !== null) window.history.replaceState(null, '', startUrl.current);
    };

    return (
        <Stage>
            <StageHeader
                title="Follow the address bar"
                hint="These buttons call history.pushState, the same thing a client-side router does. The browser back button works too."
            />
            <div className="space-y-4">
                <Row>
                    {TARGETS.map((target) => (
                        <Button key={target} variant="secondary" size="sm" className="font-mono" onClick={() => push(target)}>
                            {target}
                        </Button>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => window.history.back()}>Back</Button>
                    <Button variant="ghost" size="sm" onClick={reset}>Reset URL</Button>
                </Row>
                <ReadoutGrid>
                    <Readout label="pathname" value={pathname}/>
                    <Readout label="search" value={search || '""'} tone={search ? 'signal' : 'default'}/>
                    <Readout label="hash" value={hash || '""'} tone={hash ? 'signal' : 'default'}/>
                </ReadoutGrid>
                <Log entries={log}/>
                <Note>Reset URL uses replaceState, so it updates the readouts without adding a history entry.</Note>
            </div>
        </Stage>
    );
}
