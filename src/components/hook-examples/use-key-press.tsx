'use client'

import {useEffect, useState} from 'react';
import {useKeyPress} from '@zenuilabs/react-hooks';
import {Kbd, Note, Readout, ReadoutGrid, Stage, StageHeader} from '@/components/demo';

function Key({label, pressed}: { label: string; pressed: boolean }) {
    return (
        <div
            className={
                pressed
                    ? 'flex h-14 w-14 items-center justify-center rounded-xl border-2 border-accent bg-accent-soft font-mono text-sm text-ink'
                    : 'flex h-14 w-14 items-center justify-center rounded-xl border border-line-strong border-b-4 bg-panel font-mono text-sm text-ink-2'
            }
        >
            {label}
        </div>
    );
}

export default function UseKeyPressDemo() {
    const up = useKeyPress('ArrowUp');
    const down = useKeyPress('ArrowDown');
    const left = useKeyPress('ArrowLeft');
    const right = useKeyPress('ArrowRight');
    const shift = useKeyPress('Shift');
    const [pos, setPos] = useState({x: 50, y: 50});

    // Move the dot while arrows are held. Shift moves faster.
    useEffect(() => {
        if (!up && !down && !left && !right) return;
        const speed = shift ? 3 : 1;
        const id = setInterval(() => {
            setPos(p => ({
                x: Math.min(95, Math.max(5, p.x + ((right ? 1 : 0) - (left ? 1 : 0)) * speed)),
                y: Math.min(90, Math.max(10, p.y + ((down ? 1 : 0) - (up ? 1 : 0)) * speed)),
            }));
        }, 16);
        return () => clearInterval(id);
    }, [up, down, left, right, shift]);

    return (
        <Stage>
            <StageHeader title="Arrow key controller" hint={<>Click the arena, then hold the arrow keys to move the dot. Hold <Kbd>Shift</Kbd> to go faster.</>}/>
            <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
                    <div className="grid grid-cols-3 gap-1.5 self-center">
                        <span/>
                        <Key label="Up" pressed={up}/>
                        <span/>
                        <Key label="Left" pressed={left}/>
                        <Key label="Down" pressed={down}/>
                        <Key label="Right" pressed={right}/>
                    </div>
                    <div
                        tabIndex={0}
                        aria-label="Arena. Focus it and hold the arrow keys."
                        onKeyDown={e => {
                            // Keep the page from scrolling while the arena has focus.
                            if (e.key.startsWith('Arrow')) e.preventDefault();
                        }}
                        className="relative h-40 overflow-hidden rounded-xl border border-line bg-paper/60 outline-none focus:border-accent"
                    >
                        <span
                            className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
                            style={{left: `${pos.x}%`, top: `${pos.y}%`}}
                        />
                    </div>
                </div>
                <ReadoutGrid cols={4}>
                    <Readout label="ArrowUp" value={String(up)} live={up}/>
                    <Readout label="ArrowDown" value={String(down)} live={down}/>
                    <Readout label="ArrowLeft / Right" value={`${left} / ${right}`} live={left || right}/>
                    <Readout label="Shift" value={String(shift)} live={shift} tone={shift ? 'accent' : 'default'}/>
                </ReadoutGrid>
                <Note>Each key uses its own useKeyPress call. Switching to another window releases every key.</Note>
            </div>
        </Stage>
    );
}
