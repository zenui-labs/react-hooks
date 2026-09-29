'use client'

import {useEffect, useRef, useState} from 'react';
import {Eye, EyeOff} from 'lucide-react';
import {useVisibilityChange} from '@zenuilabs/react-hooks';
import {cn} from '@/lib/cn';
import {Log, Readout, ReadoutGrid, Stage, StageHeader} from '@/components/demo';

export default function UseVisibilityChangeDemo() {
    const {visible, hidden} = useVisibilityChange();
    const [log, setLog] = useState<string[]>([]);
    const [away, setAway] = useState(0);
    const hiddenAt = useRef<number | null>(null);

    useEffect(() => {
        const time = new Date().toLocaleTimeString();
        if (hidden) {
            hiddenAt.current = Date.now();
            setLog((entries) => [`${time}  hidden`, ...entries].slice(0, 8));
        } else if (hiddenAt.current !== null) {
            const seconds = (Date.now() - hiddenAt.current) / 1000;
            hiddenAt.current = null;
            setAway((total) => total + seconds);
            setLog((entries) => [`${time}  visible again after ${seconds.toFixed(1)} s`, ...entries].slice(0, 8));
        }
    }, [hidden]);

    return (
        <Stage>
            <StageHeader
                title="Leave and come back"
                hint="Switch to another tab or minimize the window for a few seconds, then return. The log records how long the page was hidden."
                live={visible}
            />
            <div className="space-y-4">
                <div
                    className={cn(
                        'flex items-center gap-3 rounded-xl border px-4 py-5 font-display text-2xl font-semibold tracking-tight',
                        visible ? 'border-accent bg-accent-soft text-ink' : 'border-line bg-panel-2 text-ink-3'
                    )}
                >
                    {visible ? <Eye size={24}/> : <EyeOff size={24}/>}
                    {visible ? 'You are watching' : 'Nobody is watching'}
                </div>
                <ReadoutGrid>
                    <Readout label="visible" value={String(visible)} live={visible}/>
                    <Readout label="hidden" value={String(hidden)}/>
                    <Readout label="time away" value={`${away.toFixed(1)} s`} tone={away ? 'signal' : 'default'}/>
                </ReadoutGrid>
                <Log entries={log} empty="The page has not been hidden yet."/>
            </div>
        </Stage>
    );
}
