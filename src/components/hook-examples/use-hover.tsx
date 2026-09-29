'use client'

import {useEffect, useRef, useState} from 'react';
import {useHover} from '@zenuilabs/react-hooks';
import {Button, Pad, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

export default function UseHoverDemo() {
    const {ref, isHovered} = useHover<HTMLDivElement>();
    const [shown, setShown] = useState(true);
    const [enters, setEnters] = useState(0);
    const [totalMs, setTotalMs] = useState(0);
    const since = useRef<number | null>(null);

    // Count hovers and add up the time spent over the card.
    useEffect(() => {
        if (isHovered) {
            since.current = performance.now();
            setEnters(n => n + 1);
        } else if (since.current !== null) {
            const start = since.current;
            since.current = null;
            setTotalMs(ms => ms + (performance.now() - start));
        }
    }, [isHovered]);

    return (
        <Stage>
            <StageHeader title="Hover card" hint="Move the pointer over the card. Hide it and show it again: the ref picks up the new element."/>
            <div className="space-y-4">
                <Row>
                    <Button variant="secondary" onClick={() => setShown(s => !s)}>{shown ? 'Hide card' : 'Show card'}</Button>
                </Row>
                {shown ? (
                    <Pad ref={ref} active={isHovered}>
                        {isHovered ? 'The pointer is over the card.' : 'Hover over this card.'}
                    </Pad>
                ) : (
                    <Pad>The card is unmounted.</Pad>
                )}
                <ReadoutGrid>
                    <Readout label="isHovered" value={String(isHovered)} live={isHovered} tone={isHovered ? 'accent' : 'default'}/>
                    <Readout label="Hovers" value={enters}/>
                    <Readout label="Time hovered" value={`${(totalMs / 1000).toFixed(1)} s`}/>
                </ReadoutGrid>
            </div>
        </Stage>
    );
}
