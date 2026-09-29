'use client'

import {useState} from 'react';
import {Cookie, Trash2} from 'lucide-react';
import {useCookie} from '@zenuilabs/react-hooks';
import {Button, Field, Input, Log, Note, Readout, ReadoutGrid, Row, Stage, StageHeader} from '@/components/demo';

const NAME = 'zenui-demo-flavor';

function SecondReader() {
    const {value} = useCookie(NAME, 'none');
    return <Readout label="second instance" value={value} tone="accent"/>;
}

export default function UseCookieDemo() {
    const {value, setValue, remove} = useCookie(NAME, 'none');
    const [draft, setDraft] = useState('oatmeal raisin');
    const [log, setLog] = useState<string[]>([]);

    const add = (entry: string) => setLog((entries) => [entry, ...entries].slice(0, 8));

    const save = () => {
        setValue(draft, {path: '/', maxAge: 60 * 60, sameSite: 'Lax'});
        add(`set "${draft}"  path=/  max-age=3600`);
    };

    const clear = () => {
        remove();
        add('removed');
    };

    return (
        <Stage>
            <StageHeader
                title="A cookie shared by two components"
                hint="Save a value and both readouts change together. Reload the page and the value is still there for an hour."
            />
            <div className="space-y-4">
                <Field label={`Value for ${NAME}`}>
                    <Row className="flex-nowrap">
                        <Input value={draft} onChange={(e) => setDraft(e.target.value)}/>
                        <Button onClick={save} className="shrink-0"><Cookie size={16}/> Save</Button>
                        <Button variant="danger" onClick={clear} className="shrink-0"><Trash2 size={16}/> Remove</Button>
                    </Row>
                </Field>
                <ReadoutGrid cols={2}>
                    <Readout label="value" value={value} tone="signal"/>
                    <SecondReader/>
                </ReadoutGrid>
                <Log entries={log} empty="No writes yet."/>
                <Note>After remove, value is an empty string. On the next load it falls back to the initial value, &quot;none&quot;.</Note>
            </div>
        </Stage>
    );
}
