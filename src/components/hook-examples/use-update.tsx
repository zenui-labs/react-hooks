'use client'

import {useRef} from 'react';
import {useUpdate} from '@zenuilabs/react-hooks';
import {Button, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

export default function UseUpdateDemo() {
    const update = useUpdate();
    const clicks = useRef(0);
    const updates = useRef(0);

    return (
        <Stage>
            <StageHeader
                title="Render on demand"
                hint="The click counter lives in a ref, so changing it does not re-render. Call update to show the latest value."
            />
            <div className="space-y-4">
                <Row>
                    <Button variant="secondary" onClick={() => { clicks.current += 1; }}>
                        Count a click (no render)
                    </Button>
                    <Button onClick={() => { updates.current += 1; update(); }}>update()</Button>
                </Row>
                <ReadoutGrid>
                    <Readout label="Clicks shown" value={clicks.current} tone="accent"/>
                    <Readout label="update() calls" value={updates.current}/>
                    <Readout label="Last render" value={new Date().toLocaleTimeString()}/>
                </ReadoutGrid>
                <Note>Click the first button a few times. Nothing changes until you call update.</Note>
            </div>
        </Stage>
    );
}
