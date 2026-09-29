'use client'

import {useRef, useState} from 'react';
import {GripVertical} from 'lucide-react';
import {useDraggable, type DraggableAxis} from '@zenuilabs/react-hooks';
import {Button, Kbd, Log, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const AXES: DraggableAxis[] = ['both', 'x', 'y'];
const GRIDS = [0, 20, 40];

export default function UseDraggableDemo() {
    const stageRef = useRef<HTMLDivElement>(null);
    const [axis, setAxis] = useState<DraggableAxis>('both');
    const [grid, setGrid] = useState(20);
    const [entries, setEntries] = useState<string[]>([]);

    const log = (line: string) => setEntries((previous) => [line, ...previous].slice(0, 12));

    const {ref, position, isDragging, setPosition, reset} = useDraggable<HTMLDivElement>({
        axis,
        bounds: 'parent',
        grid: grid ? [grid, grid] : undefined,
        initial: {x: 20, y: 20},
        onDragStart: (pos, event) => log(`onDragStart at ${pos.x}, ${pos.y} (${event.pointerType})`),
        onDragEnd: (pos, event) => log(`onDragEnd at ${pos.x}, ${pos.y} (${event.type === 'keydown' ? 'keyboard' : 'pointer'})`),
    });

    const center = () => {
        const stage = stageRef.current;
        if (!stage) return;
        // The card is 176 x 96. setPosition snaps and clamps like a drag.
        setPosition({x: (stage.clientWidth - 176) / 2, y: (stage.clientHeight - 96) / 2});
    };

    const gridLines = grid
        ? {
            backgroundImage: 'linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)',
            backgroundSize: `${grid}px ${grid}px`,
        }
        : undefined;

    return (
        <Stage>
            <StageHeader
                title="Drag the card"
                hint={<>Drag with a mouse, finger or pen. It stays inside the stage and snaps to the grid. Focus it and use <Kbd>Arrow</Kbd> keys too.</>}
                live={isDragging}
            />
            <div className="space-y-4">
                <Row>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">axis</span>
                    {AXES.map((value) => (
                        <Button key={value} size="sm" variant={value === axis ? 'primary' : 'secondary'} onClick={() => setAxis(value)}>
                            {value}
                        </Button>
                    ))}
                    <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">grid</span>
                    {GRIDS.map((value) => (
                        <Button key={value} size="sm" variant={value === grid ? 'primary' : 'secondary'} onClick={() => setGrid(value)}>
                            {value ? `${value}px` : 'off'}
                        </Button>
                    ))}
                </Row>
                <div
                    ref={stageRef}
                    className="relative h-72 overflow-hidden rounded-xl border border-line-strong bg-paper/70"
                    style={gridLines}
                >
                    <div
                        ref={ref}
                        aria-label={`Draggable card at ${position.x}, ${position.y}. Use arrow keys to move.`}
                        className={
                            'absolute left-0 top-0 flex h-24 w-44 select-none flex-col justify-between rounded-xl border bg-panel p-3 outline-none transition-shadow focus-visible:border-accent '
                            + (isDragging ? 'cursor-grabbing border-accent shadow-lg' : 'cursor-grab border-line-strong shadow-sm')
                        }
                        style={{transform: `translate(${position.x}px, ${position.y}px)`}}
                    >
                        <div className="flex items-center gap-1.5 text-sm font-medium text-ink">
                            <GripVertical className="size-4 text-ink-3"/>
                            Sticky note
                        </div>
                        <div className="font-mono text-xs tabular-nums text-ink-2">
                            x {position.x.toFixed(0)} / y {position.y.toFixed(0)}
                        </div>
                    </div>
                </div>
                <Row>
                    <Button onClick={center}>Center it</Button>
                    <Button variant="secondary" onClick={reset}>Reset</Button>
                </Row>
                <ReadoutGrid cols={4}>
                    <Readout label="position.x" value={position.x.toFixed(0)}/>
                    <Readout label="position.y" value={position.y.toFixed(0)}/>
                    <Readout label="isDragging" value={String(isDragging)} live={isDragging}/>
                    <Readout label="Step" value={grid ? `${grid}px grid` : '10px keys'} tone="accent"/>
                </ReadoutGrid>
                <Log entries={entries} empty="Drag the card to see events."/>
            </div>
        </Stage>
    );
}
