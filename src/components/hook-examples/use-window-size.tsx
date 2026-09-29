'use client'

import {useWindowSize} from '@zenuilabs/react-hooks';
import {Note, Readout, ReadoutGrid, Stage, StageHeader} from '@/components/demo';

const BREAKPOINTS: [string, number][] = [['2xl', 1536], ['xl', 1280], ['lg', 1024], ['md', 768], ['sm', 640]];

function breakpoint(width: number) {
    const match = BREAKPOINTS.find(([, min]) => width >= min);
    return match ? match[0] : 'base';
}

export default function UseWindowSizeDemo() {
    const {width, height} = useWindowSize();
    const ratio = width && height ? width / height : 16 / 9;
    // Draw the window as a box that keeps its aspect ratio inside a fixed frame.
    const boxWidth = ratio >= 1 ? 100 : ratio * 100;
    const boxHeight = ratio >= 1 ? 100 / ratio : 100;

    return (
        <Stage>
            <StageHeader title="Window size" hint="Resize the browser window or rotate your device." live={width > 0}/>
            <div className="space-y-4">
                <div className="flex h-48 items-center justify-center rounded-xl border border-line bg-paper/60 p-4">
                    <div className="flex aspect-square h-full items-center justify-center">
                        <div
                            className="flex items-center justify-center rounded-lg border-2 border-accent bg-accent-soft font-mono text-xs text-ink transition-all duration-200"
                            style={{width: `${boxWidth}%`, height: `${boxHeight}%`}}
                        >
                            {width} x {height}
                        </div>
                    </div>
                </div>
                <ReadoutGrid cols={4}>
                    <Readout label="width" value={`${width}px`} tone="accent"/>
                    <Readout label="height" value={`${height}px`} tone="accent"/>
                    <Readout label="Breakpoint" value={breakpoint(width)}/>
                    <Readout label="Aspect ratio" value={ratio.toFixed(2)}/>
                </ReadoutGrid>
                <Note>On the server and the first client render the size is 0 x 0, so the markup matches during hydration.</Note>
            </div>
        </Stage>
    );
}
