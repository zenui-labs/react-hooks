'use client'

import {useEffect, useState} from 'react';
import {Lock, LockOpen} from 'lucide-react';
import {useLockBodyScroll} from '@zenuilabs/react-hooks';
import {Button, Led, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

function Locker({lock}: { lock: boolean }) {
    useLockBodyScroll(lock);
    return null;
}

export default function UseLockBodyScrollDemo() {
    const [modal, setModal] = useState(false);
    const [drawer, setDrawer] = useState(false);
    const [overflow, setOverflow] = useState('');

    // The hook returns nothing. Read the body style after each change to show its effect.
    useEffect(() => {
        setOverflow(document.body.style.overflow || 'visible');
    }, [modal, drawer]);

    const locked = modal || drawer;

    return (
        <Stage>
            <StageHeader
                title="Two locks, one page"
                hint="Turn on a lock and try to scroll the page. Turn on both, then release one: the page stays locked until the last lock is gone."
                live={locked}
            />
            <div className="space-y-4">
                <Locker lock={modal}/>
                <Locker lock={drawer}/>
                <Row>
                    <Button variant={modal ? 'primary' : 'secondary'} onClick={() => setModal(!modal)}>
                        {modal ? <Lock size={16}/> : <LockOpen size={16}/>} Modal lock
                    </Button>
                    <Button variant={drawer ? 'primary' : 'secondary'} onClick={() => setDrawer(!drawer)}>
                        {drawer ? <Lock size={16}/> : <LockOpen size={16}/>} Drawer lock
                    </Button>
                    <Led on={locked} label={locked ? 'Page locked' : 'Page scrolls'}/>
                </Row>
                <ReadoutGrid>
                    <Readout label="modal lock" value={String(modal)}/>
                    <Readout label="drawer lock" value={String(drawer)}/>
                    <Readout label="body overflow" value={overflow} tone={locked ? 'signal' : 'default'}/>
                </ReadoutGrid>
                <Note>On desktop, the scrollbar disappears while locked and the body gets matching right padding, so the page does not jump sideways.</Note>
            </div>
        </Stage>
    );
}
