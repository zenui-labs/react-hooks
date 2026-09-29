'use client'

import {useState} from 'react';
import {usePageLeave} from '@zenuilabs/react-hooks';
import {Button, Log, Pad, Readout, ReadoutGrid, Stage, StageHeader} from '@/components/demo';

function edgeOf(event?: MouseEvent) {
    if (!event) return 'unknown';
    if (event.clientY <= 0) return 'top';
    if (event.clientX <= 0) return 'left';
    if (event.clientX >= window.innerWidth - 1) return 'right';
    return 'bottom';
}

export default function UsePageLeaveDemo() {
    const [count, setCount] = useState(0);
    const [edge, setEdge] = useState('none');
    const [log, setLog] = useState<string[]>([]);
    const [offer, setOffer] = useState(false);

    usePageLeave((event) => {
        const side = edgeOf(event);
        setCount((n) => n + 1);
        setEdge(side);
        if (side === 'top') setOffer(true);
        setLog((entries) => [`${new Date().toLocaleTimeString()}  left through the ${side} edge`, ...entries].slice(0, 8));
    });

    return (
        <Stage>
            <StageHeader
                title="Exit intent"
                hint="Move the pointer out of the browser window, for example up toward the tabs. Leaving through the top edge opens the offer."
                live={offer}
            />
            <div className="space-y-4">
                <Pad active={offer}>
                    {offer ? (
                        <div className="space-y-3">
                            <p className="font-display text-xl font-semibold text-ink">Before you go: 10% off with STAY10</p>
                            <Button size="sm" variant="secondary" onClick={() => setOffer(false)}>No thanks</Button>
                        </div>
                    ) : 'Nothing yet. Head for the address bar.'}
                </Pad>
                <ReadoutGrid cols={2}>
                    <Readout label="leaves" value={count} tone={count ? 'signal' : 'default'}/>
                    <Readout label="last edge" value={edge}/>
                </ReadoutGrid>
                <Log entries={log} empty="The pointer has not left the page."/>
            </div>
        </Stage>
    );
}
